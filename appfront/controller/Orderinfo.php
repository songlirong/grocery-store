<?php
namespace app\appfront\controller;
use \app\appfront\model\OrderinfoModel;
use \app\appfront\model\OrderproductsModel;
use app\appfront\model\ProductModel;
use \app\appfront\model\UserinfoModel;
use \app\appfront\model\ReceivingaddressModel;
use \app\appfront\model\CartModel;
use \app\appfront\model\CommentModel;
class Orderinfo
{
    // 立即下单
    public function placeOrder()
    {
        $request = request()->param();
        // 用户个人信息
        $user = UserinfoModel::where('open_id', $request['openId'])
            ->find();
        // 用户收货地址信息
        $address = ReceivingaddressModel::where('address_id', $request['addressId'])
            ->find();
        // 随机产生的订单号
        $orderSn = 'IMMORTAL' . date('Ymdhms') . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        // 订单中的商品信息
        $product = CartModel::where('user_id', $user['user_id'])
            ->where('goods_status', 1)
            ->join('product', 'cart.goods_id = product.id')
            ->select();
        $price = 0;
        foreach ($product as $value) {
            $price += $value['goods_number'] * $value['special_price'];
        }
        $dataArr = [
            'order_sn' => $orderSn,
            'user_id' => $user['user_id'],
            'address' => $address['address_info'],
            'phone' => $address['receiving_phone'],
            'receiver_name' => $address['receiving_name'],
            'order_price' => sprintf("%.2f", $price),
            'add_time' => time()
        ];
        $rew = OrderinfoModel::insert($dataArr);
        if ($rew) {
            $currentOrder = OrderinfoModel::where('order_sn', $orderSn)
                ->find();
            foreach ($product as $value) {
                $dataProducts = [
                    'product_id' => $value['id'],
                    'order_id' => $currentOrder['id'],
                    'count' => $value['goods_number'],
                ];
                $re = OrderproductsModel::insert($dataProducts);
            }
            $rewCart = CartModel::where('user_id', $user['user_id'])
                ->where('goods_status', 1)
                ->delete();
            if ($rewCart) {
                $returnData['code'] = 0;
            } else {
                $returnData['code'] = 1;
            }
        } else {
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
    // 待付款订单
    public function pendingPayment(){
        $request = request()->param();
//        dump($request);
        // 用户个人信息
        $user = UserinfoModel::where('open_id', $request['openId'])
            ->find();
        if($request['orderStatus'] == 0){
            $orderInfo = OrderinfoModel::where('user_id',$user['user_id'])
                ->order('order_status desc')
                ->select();
            foreach ($orderInfo as $value){
                $value['orderProducts'] = OrderproductsModel::where('order_id',$value['id'])
                    ->join('product','order_products.product_id = product.id')
                    ->select();
            }
        }else{
            $orderInfo = OrderinfoModel::where('user_id',$user['user_id'])
                ->where('order_status',$request['orderStatus'])
                ->select();
            foreach ($orderInfo as $value){
                $value['orderProducts'] = OrderproductsModel::where('order_id',$value['id'])
                    ->join('product','order_products.product_id = product.id')
                    ->select();
            }
        }
        if($orderInfo){
            $returnData['code'] = 0;
            $returnData['orderInfo'] = $orderInfo;
        }else{
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
    //待付款订单的详情
    public function pendingPayment1(){
        $request = request()->param();

        $orderInfo = OrderinfoModel::where('order_sn',$request['ordernum'])
            ->select();

        foreach ($orderInfo as $value){
            $value['orderProducts'] = OrderproductsModel::where('order_id',$value['id'])
                ->join('product','order_products.product_id = product.id')
                ->select();
        }
        if($orderInfo){
            $returnData['code'] = 0;
            $returnData['orderInfo'] = $orderInfo;
        }else{
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
    // 确认收货
    public function confirmReceipt(){
        $request = request()->param();
        // 用户个人信息
        $user = UserinfoModel::where('open_id', $request['openId'])
            ->find();
        $row = OrderinfoModel::where('user_id',$user['user_id'])
            ->where('id',$request['orderId'])
            ->where('order_status',4)
            ->find();
        if($row){
            $returnData['code'] = 2;
        }else{
            $rew = OrderinfoModel::where('user_id',$user['user_id'])
                ->where('id',$request['orderId'])
                ->setField('order_status',4);
            if($rew){
                $returnData['code'] = 0;
            }else{
                $returnData['code'] = 1;
            }
        }
        return json_encode($returnData);
    }
    // 获取评价的订单信息
    public function getOrder()
    {
        $request = request()->param();
        $row = OrderinfoModel::where('order_sn', $request['orderSn'])
            ->find();
        if ($row) {
            $product = OrderproductsModel::where('order_id', $row['id'])
                ->join('product', 'product.id = order_products.product_id')
                ->select();
            if ($product) {
                $returnData['code'] = 0;
                $returnData['order'] = $row;
                $returnData['product'] = $product;
            } else {
                $returnData['code'] = 1;
            }
        } else {
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
    // 发布评价
    public function release()
    {
        $request = request()->param();
        // 用户个人信息
        $user = UserinfoModel::where('open_id', $request['openId'])
            ->find();
        $rew = CommentModel::where('order_num',$request['orderSn'])
            ->find();
        if($rew){
            $returnData['code'] = 1;
            $returnData['msg'] = '订单已评价';
        }else{
            if ($request['currentIdx'] == 1) {
                $status = 1;
            } else if ($request['currentIdx'] == 2) {
                $status = 0;
            } else if ($request['currentIdx'] == 3) {
                $status = -1;
            }
            $dataArr = [
                'from_uid' => $user['user_id'],
                'thumb_img' => $user['avatar_url'],
                'nickname' => $user['nick_name'],
                'create_time' => date('Y-m-d'),
                'order_num' => $request['orderSn'],
                'status' => $status,
                'content' => $request['content']
            ];
            $rw = CommentModel::insert($dataArr);
            if($rw){
                $rng = OrderinfoModel::where('order_sn',$request['orderSn'])
                    ->setField('order_status',0);
                if($rng){
                    $returnData['code'] = 0;
                    $returnData['msg'] = '评价成功';
                }else{
                    $returnData['code'] = 1;
                    $returnData['msg'] = '评价失败';
                }
            }else{
                $returnData['code'] = 1;
                $returnData['msg'] = '评价失败';
            }
        }
        return json_encode($returnData);
    }
}
