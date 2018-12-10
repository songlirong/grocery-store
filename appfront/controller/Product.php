<?php

namespace app\appfront\controller;

use \app\appfront\model\ProductModel;
use \app\appfront\model\CartModel;
use \app\appfront\model\CategoryModel;

class Product
{
    public function getGoods()
    {
        $request = request();
        $data = $request->param();
        $category = $data['parentId'] . ',' . $data['categoryId'];
        $start = ($data['page'] - 1) * 10;
        $pages = ProductModel::where('category', $category)->select();
        $total = ceil(count($pages) / 10);
        $productInfo = ProductModel::where('category', $category)
            ->order('id asc')
            ->limit($start, 10)
            ->select();
        if ($productInfo) {
            $returnData['code'] = 0;
            $returnData['total'] = $total;
            $returnData['productInfo'] = $productInfo;
        } else {
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
    public function getProduct(){
        $request = request();
        $data = $request->param();
        $product = ProductModel::where('id',$data['productId'])
            ->find();
//        $product['orderinfo'] = CartModel::where('goods_id',$product['id'])
//            ->find();
        if($product){
            $returnData['code'] = 0;
            $returnData['product'] = $product;
        }else{
            $returnData['code'] = 1;
        }
        return json_encode($returnData);
    }
    //获取搜索的商品内容及分类
//    public function searchProduct(){
//        $request=request()->get('keywords');
//        $res=ProductModel::where('name', 'like', '%'.$request.'%')->select();
//        $cateArr = [];
//        foreach ($res as $value){
//            $category = explode(',',$value['category'])[0];
//            $data=CategoryModel::where('id',$category)->find();
//            $isIn = in_array($data,$cateArr);
//            if(!$isIn){
//                array_push($cateArr,$data);
//            }
//        }
//        $returnData['product'] = $res;
//        $returnData['category'] = $cateArr;
//        return json_encode($returnData);
//    }
    // 搜索商品并排序
    public function searchProduct()
    {
        $request = request()->param();
        if ($request['sort'] == 0) {
            $res = ProductModel::where('name', 'like', '%' . $request['keywords'] . '%')
                ->select();
        } else if ($request['sort'] == 1) {
            $res = ProductModel::where('name', 'like', '%' . $request['keywords'] . '%')
                ->order('special_price desc')
                ->select();
        } else if ($request['sort'] == 2) {
            $res = ProductModel::where('name', 'like', '%' . $request['keywords'] . '%')
                ->order('special_price asc')
                ->select();
        }
        $cateArr = [];
        foreach ($res as $value) {
            $category = explode(',', $value['category'])[0];
            $data = CategoryModel::where('id', $category)->find();
            $isIn = in_array($data, $cateArr);
            if (!$isIn) {
                array_push($cateArr, $data);
            }
        }
        $returnData['category'] = $cateArr;
        if ($request['category'] != 0) {
            if ($request['sort'] == 0) {
                $res = ProductModel::where('name', 'like', '%' . $request['keywords'] . '%')
                    ->where('category', 'like', '%' . $request['category'] . ',' . '%')
                    ->select();
            } else if ($request['sort'] == 1) {
                $res = ProductModel::where('name', 'like', '%' . $request['keywords'] . '%')
                    ->where('category', 'like', '%' . $request['category'] . ',' . '%')
                    ->order('special_price desc')
                    ->select();
            } else if ($request['sort'] == 2) {
                $res = ProductModel::where('name', 'like', '%' . $request['keywords'] . '%')
                    ->where('category', 'like', '%' . $request['category'] . ',' . '%')
                    ->order('special_price asc')
                    ->select();
            }
        }
        $returnData['product'] = $res;
        return json_encode($returnData);
    }
}