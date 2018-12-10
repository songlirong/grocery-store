<?php
namespace app\appfront\controller;
use \app\appfront\model\ReceivingaddressModel;
use \app\appfront\model\UserinfoModel;
class Receivingaddress
{
    //新增收货地址
    public function locationAdd()
    {
        $request = request()->param();
        $user = UserinfoModel::where('open_id', $request['openId'])->find();
        $data = json_decode($request['data'], true);
        $dataArr = [
            'user_id' => $user['user_id'],
            'receiving_name' => $data['username'],
            'receiving_phone' => $data['userphone'],
            'address_info' => $data['address'] . $data['location'],
            'address_label' => $request['label'],
        ];
        $row = ReceivingaddressModel::where($dataArr)->find();
        if ($row) {
            $returnData['code'] = 1;
            $returnData['msg'] = '已有该地址，请勿重复添加';
        } else {
            $rew = ReceivingaddressModel::insert($dataArr);
            if ($rew) {
                $returnData['code'] = 0;
                $returnData['msg'] = '地址添加成功';
            } else {
                $returnData['code'] = 1;
                $returnData['msg'] = '地址添加失败，请重新添加';
            }
        }
        return json_encode($returnData);
    }
    //获取全部收货地址
    public function getAllLocation()
    {
        $request = request()->param();
        $user = UserinfoModel::where('open_id', $request['openId'])->find();
        $locationInfo = ReceivingaddressModel::where('user_id', $user['user_id'])->select();
        if ($locationInfo) {
            $returnData['code'] = 0;
            $returnData['msg'] = 'success';
            $returnData['locationInfo'] = $locationInfo;
        } else {
            $returnData['code'] = 0;
            $returnData['msg'] = '地址空空如也';
        }
        return json_encode($returnData);
    }
    //收货地址的切换
    public function locationChoose()
    {
        $request = request()->param();
        $user = UserinfoModel::where('open_id', $request['openId'])->find();
        $before = [
            'user_id' => $user['user_id'],
            'address_id' => $request['beforeChoice']
        ];
        $current = [
            'user_id' => $user['user_id'],
            'address_id' => $request['currentChoice']
        ];
        $row = ReceivingaddressModel::where($current)->find();
        if ($request['beforeChoice'] == 0) {
            if ($row['address_status'] == 1) {
                $returnData['code'] = 0;
                $returnData['addressId'] = $row['address_id'];
                $returnData['addressInfo'] = $row['address_info'];
            } else {
                $rew = ReceivingaddressModel::where($current)->setField('address_status', 1);
                if ($rew) {
                    $returnData['code'] = 0;
                    $returnData['addressId'] = $request['currentChoice'];
                    $returnData['addressInfo'] = $row['address_info'];
                } else {
                    $returnData['code'] = 1;
                }
            }
        } else {
            if ($row['address_status'] == 1) {
                $returnData['code'] = 0;
                $returnData['addressId'] = $row['address_id'];
                $returnData['addressInfo'] = $row['address_info'];
            } else {
                $beforeRew = ReceivingaddressModel::where($before)->setField('address_status', 0);
                if ($beforeRew) {
                    $rew = ReceivingaddressModel::where($current)->setField('address_status', 1);
                    if ($rew) {
                        $returnData['code'] = 0;
                        $returnData['addressId'] = $request['currentChoice'];
                        $returnData['addressInfo'] = $row['address_info'];
                    } else {
                        $returnData['code'] = 1;
                    }
                } else {
                    $returnData['code'] = 1;
                }
            }
        }
        return json_encode($returnData);
    }
    //确认订单时获取当前收货地址
    public function getLocationInfo(){
        $request = request()->param();
        $user = UserinfoModel::where('open_id',$request['openId'])
            ->find();
        $row = ReceivingaddressModel::where('user_id',$user['user_id'])
            ->where('address_status',1)
            ->find();
        if($row){
            $returnData['code'] = 0;
            $returnData['locationInfo'] = $row;
        }else{
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
}