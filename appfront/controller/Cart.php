<?php

namespace app\appfront\controller;

use \app\appfront\model\CartModel;
use \app\appfront\model\ProductModel;
use \app\appfront\model\UserinfoModel;

class Cart
{
    //加入购物车
    public function addCart()
    {
        $request = request();
        $data = $request->param();
        $user = UserinfoModel::where('open_id',$data['openId'])->find();
        $row = CartModel::where('goods_id', $data['productId'])
            ->where('user_id',$user['user_id'])
            ->find();

        if ($row) {
            $number = $row['goods_number'] + 1;
            $rew = CartModel::where('id', $row['id'])
                ->setField('goods_number', $number);
            if ($rew == 1) {
                $returnData['code'] = 0;
            } else {
                $returnData['code'] = 1;
            }
        } else {
            $insertData = [
                'goods_id' => $data['productId'],
                'goods_number' => 1,
                'user_id'=>$user['user_id']
            ];
            $rew = CartModel::insert($insertData);
            if ($rew == 1) {
                $returnData['code'] = 0;
            } else {
                $returnData['code'] = 1;
            }
        }
        return json_encode($returnData);
    }
    //购物车分页获取加购商品
    public function getProduct()
    {
        $request = request();
        $data = $request->param();
		$user=UserinfoModel::where('open_id',$data['openId'])->find();
        $start = ($data['currentPage'] - 1) * 10;
        $cartProduct = CartModel::where('user_id',$user['user_id'])
			->order('id asc')
            ->limit($start, 10)
            ->select();
        foreach ($cartProduct as $value) {
            $product = ProductModel::where('id', $value['goods_id'])
                ->find();
            if ($product) {
                $value['product'] = $product;
            } else {
                $value['product'] = null;
            }
        };
        if ($cartProduct) {
            $returnData['code'] = 0;
            $returnData['cartProduct'] = $cartProduct;
        }else{
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }

    //数量减一
    public function minusCount()
    {
        $request = request();
        $data = $request->param();
        $row = CartModel::where('id', $data['cartProductId'])
            ->find();
        if ($row['goods_number'] == 1) {
            $returnData['code'] = 1;
            $returnData['msg'] = "warning";
        } else {
            $number = $row['goods_number'] - 1;
            $rew = CartModel::where('id', $data['cartProductId'])
                ->setField('goods_number', $number);
            if ($rew == 1) {
                $returnData['code'] = 0;
                $returnData['msg'] = "success";
            } else {
                $returnData['code'] = 1;
                $returnData['msg'] = "fail";
            }
        }
        return json_encode($returnData);
    }

    //数量加一
    public function addCount()
    {
        $request = request();
        $data = $request->param();
        $row = CartModel::where('id', $data['cartProductId'])
            ->find();
        $number = $row['goods_number'] + 1;
        $rew = CartModel::where('id', $data['cartProductId'])
            ->setField('goods_number', $number);
        if ($rew == 1) {
            $returnData['code'] = 0;
            $returnData['msg'] = "success";
        } else {
            $returnData['code'] = 1;
            $returnData['msg'] = "fail";
        }
        return json_encode($returnData);
    }

    //自定义数量
    public function bindManual()
    {
        $request = request();
        $data = $request->param();
        $row = CartModel::where('id', $data['cartProductId'])
            ->find();
        $rew = CartModel::where('id', $data['cartProductId'])
            ->setField('goods_number', $data['goodsNumber']);
        if ($rew == 1) {
            $returnData['code'] = 0;
            $returnData['msg'] = "success";
        } else {
            $returnData['code'] = 1;
            $returnData['msg'] = "fail";
        }
        return json_encode($returnData);
    }

    //修改选中状态
    public function selectList()
    {
        $request = request()->param();
        if ($request['productStatus'] == 1) {
            $status = '0';
        } else if ($request['productStatus'] == 0) {
            $status = '1';
        }
        $rew = CartModel::where('id', $request['cartProductId'])
            ->setField('goods_status', $status);
        if ($rew) {
            $returnData['code'] = 0;
            $returnData['msg'] = 'success';
        } else {
            $returnData['code'] = 1;
            $returnData['msg'] = 'fail';
        }
        return json_encode($returnData);
    }

    //全选
    public function selectAll()
    {
        $request = request()->param();
        $data = UserinfoModel::where('open_id', $request['openId'])->find();
        $rew = CartModel::where('user_id', $data['user_id'])
            ->setField('goods_status', $request['goodsStatus']);
        if ($rew == 0) {
            $returnData['code'] = 1;
        } else {
            $returnData['code'] = 0;
            $returnData['goodsStatus'] = $request['goodsStatus'] ? true : false;
        }
        return json_encode($returnData);
    }

    //结算
    public function settlement()
    {
        $request = request()->param();
        $user = UserinfoModel::where('open_id', $request['openId'])->find();
        $dataArr = [
            'goods_status' => 1,
            'user_id' => $user['user_id']
        ];
        $row = CartModel::where($dataArr)->select();

        foreach ($row as $value) {
            $product = ProductModel::where('id', $value['goods_id'])
                ->find();
            if ($product) {
                $value['product'] = $product;
            } else {
                $value['product'] = null;
            }
        };
        if ($row) {
            $returnData['code'] = 0;
            $returnData['carproduct'] = $row;
        }else{
            $returnData['code'] = 1;
        }

        return json_encode($returnData);
    }
    //删除购物车中的商品
    public function deleteList(){
        $request = request()->param();
        $data = UserinfoModel::where('open_id', $request['openId'])->find();
        $row = CartModel::where('goods_id',$request['goods_id'])
            ->where('user_id', $data['user_id'])
            ->delete();
        if ($row) {
            $returnData['code'] = 1;
        } else {
            $returnData['code'] = 0;
        }
        return json_encode($returnData);
    }
    //删除选中所有商品
    public function delAll(){
        $request=request()->param();
        $data = UserinfoModel::where('open_id', $request['openId'])->find();
        $row = CartModel::where('user_id', $data['user_id'])
            ->where('goods_status', 1)
            ->delete();
        if ($row) {
            $returnData['code'] = 1;
        } else {
            $returnData['code'] = 0;
        }
        return json_encode($returnData);
    }
}