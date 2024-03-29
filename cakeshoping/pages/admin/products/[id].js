import { useState, useEffect } from 'react';
import ProductItem from '../../../components/ProductItem';
import Updating from '../../../components/Updating';
import {
  getProduct,
  getPhoto,
  deletePhoto,
  deleteProduct,
  updateProduct,
  addNewPhoto,
} from '../../../pages/api/webAPI';
import { server } from '../../../config';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectAdminUser } from '../../../features/adminUserSlice';
import NotFound from '../../../components/NotFound';

export default function Product({ productData, photosData }) {
  const adminUser = useSelector(selectAdminUser);
  const [productName, setProductName] = useState(productData.productName);
  const [type, setType] = useState(productData.type);
  const [price, setPrice] = useState(productData.price);
  const [articlel, setArticlel] = useState(productData.articlel);
  const [isShow, setIsShow] = useState(productData.isShow ? true : false);
  const [storage, setStorage] = useState(productData.storage);
  const [sell, setSell] = useState(productData.sell);
  const [isDeleted, setIsDeleted] = useState(productData.isDeleted);
  const [photos, setPhotos] = useState(photosData);
  const [photoSrc, setPhotoSrc] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  if (!id) return <></>;

  const handleUploadFile = async (e) => {
    let fromData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      fromData.append('avatar', e.target.files[i]);
    }
    fromData.append('productId', id);
    setIsUpdating(true);
    await addNewPhoto(fromData).then((res) => {
      if (!res) {
        setIsUpdating(false);
        return setErrorMessage(true);
      }
      if (res.statusText === 'OK') {
        setIsUpdating(false);
        getPhoto(id).then((res) => {
          setPhotos(res.data.result);
        });
      }
    });
  };

  const handleUpdateProduct = async (data) => {
    await updateProduct(data);
    const res = await updateProduct(data);
    if(res.data.ok === 1) {
      router.reload();
    }
  };

  const handleDeletePhoto = async (id) => {
    let deleteMessage = window.confirm('確定刪除圖片？');
    if (deleteMessage) {
      setPhotos(photos.filter((photo) => photo.id !== id));
      await deletePhoto(id);
    }
  };
  const handleDeleteProduct = async (id) => {
    let deleteMessage = window.confirm('確定刪除商品？')
    if (deleteMessage) {
      await deleteProduct(id);
      router.push('/admin/products');
    }
    
    
  };
  const handleIsShowClick = (e) => {
    setIsShow(e.target.checked);
  };

  const getProductData = async () => {
    const res = await getProduct(id);
    const productData = await res.data.result[0]
    return productData
  }

  const getPhotosData = async () => {
    const photosData = await getPhoto(id);
    return photosData.data.result
  }

  useEffect(() => {
    getProductData()
    getPhotosData()
  },[])

  return (
    <>
      {isUpdating && <Updating />}
      {errorMessage && <div>發生錯誤請再試一次</div>}
      {adminUser.role === 'admin' ? (
        <ProductItem
          title={`編輯商品 ID:`}
          photos={photos}
          productName={productName}
          type={type}
          price={price}
          articlel={articlel}
          isShow={isShow}
          storage={storage}
          sell={sell}
          id={id}
          setProductName={setProductName}
          setType={setType}
          setPrice={setPrice}
          setArticlel={setArticlel}
          setStorage={setStorage}
          setSell={setSell}
          isDeleted={isDeleted}
          handleUpdateProduct={handleUpdateProduct}
          handleDeletePhoto={handleDeletePhoto}
          handleDeleteProduct={handleDeleteProduct}
          handleIsShowClick={handleIsShowClick}
          photoSrc={photoSrc}
          handleUploadFile={handleUploadFile}
        />
      ) : (
        <NotFound />
      )}
    </>
  );
}

export const getStaticProps = async (content) => {
  const { data: productData } = await getProduct(content.params.id);
  const { data: photosData } = await getPhoto(content.params.id);

  return {
    props: {
      productData: productData.result[0],
      photosData: photosData.result,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const res = await fetch(`${server}/product`);
  const products = await res.json();

  const paths = products.result.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
    // revalidate: 1,
  };
};
