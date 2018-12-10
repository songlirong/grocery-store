<?php

namespace app\appfront\controller;

use \app\appfront\model\UserinfoModel;

class Userinfo
{
    //获取用户身份
    // $appId="wx5ffd1e2f355759bb";
    // $appSecret = "f96ba3e362edb28834070aea5db6c141";
    public function getUserInfo()
    {
        $request = request()->param();
        $dataArr = json_decode($request['userInfo'], true);
        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=wx15f58fe0f602b398&secret=10957ef3d646c8b717170ba1957a9d71&js_code=" . $request['code'] . "&grant_type=authorization_code";
        $resData = json_decode(file_get_contents($url), true);
        $data = [
            "nick_name" => $dataArr['nickName'],
            "gender" => $dataArr['gender'],
            "language" => $dataArr['language'],
            "city" => $dataArr['city'],
            "province" => $dataArr['province'],
            "country" => $dataArr['country'],
            "avatar_url" => $dataArr['avatarUrl'],
            "open_id" => $resData['openid']
        ];
        $row = UserinfoModel::where('open_id', $resData['openid'])->find();
        if ($row) {
            $returnData['code'] = 0;
            $returnData['openId'] = $row['open_id'];
            $returnData['session_key'] = $resData['session_key'];
        } else {
            $rew = UserinfoModel::insert($data);
            if ($rew == 1) {
                $returnData['code'] = 0;
                $returnData['openId'] = $resData['openid'];
                $returnData['session_key'] = $resData['session_key'];
            } else {
                $returnData['code'] = 1;
            }
        }
        return json_encode($returnData);
    }
    //个人中心获取个人信息
    public function getPersonalInfo(){
        $request = request()->param();
        $row = UserinfoModel::where('open_id',$request['openId'])
            ->find();
        if($row){
            $returnData['code'] = 0;
            $returnData['personalInfo'] = $row;
        }else{
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
}