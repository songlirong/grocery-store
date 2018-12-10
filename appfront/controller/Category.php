<?php

namespace app\appfront\controller;

use \app\appfront\model\CategoryModel;
use \app\appfront\model\UserinfoModel;
use \app\appfront\model\CartModel;
class Category
{
    public function getCate()
    {
        return json_encode(CategoryModel::where('parent_id',0)
            ->order('id asc')
            ->limit(10)
            ->select());
    }

    public function getAllCate()
    {
        return json_encode(CategoryModel::where('parent_id',0)
            ->select());
    }

    public function getCategory()
    {
        $request = request();
        $parent = $request->param();
        $cate = CategoryModel::where('parent_id', $parent['id'])->select();
        $titleInfo = CategoryModel::where('id', $parent['id'])->find();
        $data['cate'] = $cate;
        $data['titleInfo'] = $titleInfo;
        return json_encode($data);
    }
    //获取购物车的商品总数量
    public function getCarNumber(){
        $request = request()->param();
        $data=UserinfoModel::where('open_id',$request['openId'])->find();
        $car=CartModel::where('user_id',$data['user_id'])
            ->select();
        $num=0;
        foreach ($car as $value){
            $num+=$value['goods_number'];
        }
        return json_encode($num);
    }
}