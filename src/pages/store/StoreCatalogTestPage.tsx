import { useState, type ReactNode } from 'react';
import PageTitle from '../../components/common/PageTitle';
import SectionHeader from '../../components/common/SectionHeader';
import Button from '../../components/common/Button';
import { getMe } from '../../api/users/userApi';
import {
  getStores,
  createStore,
  updateStoreProfile,
  changeOperationStatus,
  type StoreResponse,
  type StoreProfileResponse,
} from '../../api/store/storeApi';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
  type StoreBannerResponse,
} from '../../api/store/storeBannerApi';
import {
  getDeliveryPolicy,
  upsertDeliveryPolicy,
  type StoreDeliveryPolicyResponse,
} from '../../api/store/storeDeliveryPolicyApi';
import { getCategoriesByDepth, type CategoryResponse } from '../../api/catalog/categoryApi';
import {
  createItem,
  addVariants,
  addImage,
  getItem,
  updateItem,
  updateItemStatus,
  deleteItem,
  getImages,
  updateImage,
  deleteImage,
  updateImageOrder,
  type ItemCreateResponse,
  type AddVariantsResponse,
  type ItemImageResponse,
  type ItemDetailResponse,
  type ItemResponse,
} from '../../api/catalog/itemApi';

/**
 * Store/Catalog API 연동 확인용 최소 테스트 페이지
 * 흐름: 로그인 → 내 스토어 조회 → 카테고리 조회 → 상품 생성 → variant 추가 → 이미지 등록 → 최종 상태 확인
 * + Store 관리(프로필/영업상태/배송정책/배너), Catalog 상품 관리(수정/상태변경/삭제, 이미지 수정/삭제/순서변경) API 직접 호출
 */

const row: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  marginBottom: '10px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid var(--color-gray-2)',
  borderRadius: '6px',
  fontSize: '13px',
  backgroundColor: 'var(--color-white)',
  color: 'var(--color-black)',
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--color-gray-4)',
};

const pre: React.CSSProperties = {
  backgroundColor: 'var(--color-gray-0)',
  padding: '10px',
  borderRadius: '6px',
  fontSize: '12px',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  marginTop: '4px',
};

const buttonStyle: React.CSSProperties = { padding: '9px 16px', fontSize: '13px', borderRadius: '6px' };

/** 라벨 + 입력필드를 묶어 다른 화면의 폼 필드와 동일한 형태로 보여준다 */
function Field({ label, width, children }: { label: string; width?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: width ?? '160px' }}>
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </div>
  );
}

/** API 1건을 SectionHeader + 본문 형태로 감싸, 다른 상세 화면(주문 상세 등)과 동일한 카드 구조를 사용한다 */
function ApiSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SectionHeader title={title} />
      <div style={{ padding: '16px 24px 20px', borderBottom: '1px solid var(--color-gray-1)' }}>{children}</div>
    </>
  );
}

/** 여러 ApiSection을 묶는 그룹 제목 */
function GroupHeading({ title, desc }: { title: string; desc?: string }) {
  return (
    <div style={{ padding: '28px 24px 4px' }}>
      <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>{title}</h2>
      {desc && <p style={{ fontSize: '12px', color: 'var(--color-gray-4)', margin: '4px 0 0' }}>{desc}</p>}
    </div>
  );
}

function ResultBox({ error, result }: { error: string | null; result: unknown }) {
  if (error) {
    return <pre style={{ ...pre, color: '#c53030' }}>{error}</pre>;
  }
  if (result === null || result === undefined) return null;
  return <pre style={pre}>{JSON.stringify(result, null, 2)}</pre>;
}

export default function StoreCatalogTestPage() {
  // 0. 내 정보
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [meError, setMeError] = useState<string | null>(null);

  // 1. 스토어
  const [stores, setStores] = useState<StoreResponse[] | null>(null);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [storeId, setStoreId] = useState('');
  const [newStoreName, setNewStoreName] = useState('테스트 스토어');
  const [createStoreError, setCreateStoreError] = useState<string | null>(null);
  const [createdStore, setCreatedStore] = useState<StoreResponse | null>(null);

  // 2. 카테고리
  const [categories, setCategories] = useState<CategoryResponse[] | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState('');

  // 3. 상품 생성
  const [itemName, setItemName] = useState('테스트 상품');
  const [basePrice, setBasePrice] = useState('20000');
  const [sku, setSku] = useState(`SKU-${Date.now()}`);
  const [variantPrice, setVariantPrice] = useState('20000');
  const [initialQuantity, setInitialQuantity] = useState('10');
  const [optionType, setOptionType] = useState<'SIZE' | 'COLOR'>('COLOR');
  const [optionValue, setOptionValue] = useState('BLACK');
  const [itemCreateResult, setItemCreateResult] = useState<ItemCreateResponse | null>(null);
  const [itemCreateError, setItemCreateError] = useState<string | null>(null);

  // 4. variant 추가
  const [itemIdForVariant, setItemIdForVariant] = useState('');
  const [addSku, setAddSku] = useState(`SKU-${Date.now()}-2`);
  const [addPrice, setAddPrice] = useState('20000');
  const [addQuantity, setAddQuantity] = useState('5');
  const [addOptionType, setAddOptionType] = useState<'SIZE' | 'COLOR'>('SIZE');
  const [addOptionValue, setAddOptionValue] = useState('M');
  const [addVariantsResult, setAddVariantsResult] = useState<AddVariantsResponse | null>(null);
  const [addVariantsError, setAddVariantsError] = useState<string | null>(null);

  // 5. 이미지 등록
  const [itemIdForImage, setItemIdForImage] = useState('');
  const [imageUrl, setImageUrl] = useState('https://example.com/images/product1.jpg');
  const [isPrimary, setIsPrimary] = useState(true);
  const [altText, setAltText] = useState('상품 대표 이미지');
  const [imageResult, setImageResult] = useState<ItemImageResponse | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // 6. 최종 상태 확인
  const [itemIdForCheck, setItemIdForCheck] = useState('');
  const [finalItem, setFinalItem] = useState<ItemDetailResponse | null>(null);
  const [finalItemError, setFinalItemError] = useState<string | null>(null);

  // ── A. Store 관리 (storeId는 위 1번 단계에서 확보한 값을 재사용) ──

  // A1. 프로필 수정
  const [profileDescription, setProfileDescription] = useState('최고의 상품을 판매합니다');
  const [profileNotice, setProfileNotice] = useState('공지사항 테스트');
  const [profileMainImageUrl, setProfileMainImageUrl] = useState('https://example.com/store-main.jpg');
  const [profileResult, setProfileResult] = useState<StoreProfileResponse | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // A2. 영업상태 변경
  const [operationStatus, setOperationStatus] = useState<'OPEN' | 'CLOSED' | 'PAUSED'>('OPEN');
  const [operationStatusResult, setOperationStatusResult] = useState<StoreProfileResponse | null>(null);
  const [operationStatusError, setOperationStatusError] = useState<string | null>(null);

  // A3. 배송정책 조회/등록수정
  const [baseDeliveryFee, setBaseDeliveryFee] = useState('3000');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('50000');
  const [deliveryPolicyResult, setDeliveryPolicyResult] = useState<StoreDeliveryPolicyResponse | null>(null);
  const [deliveryPolicyError, setDeliveryPolicyError] = useState<string | null>(null);

  // A4. 배너 목록 조회
  const [banners, setBanners] = useState<StoreBannerResponse[] | null>(null);
  const [bannersError, setBannersError] = useState<string | null>(null);

  // A5. 배너 등록
  const [bannerImageUrl, setBannerImageUrl] = useState('https://example.com/banner.jpg');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('https://example.com/event');
  const [bannerTitle, setBannerTitle] = useState('테스트 배너');
  const [createBannerResult, setCreateBannerResult] = useState<StoreBannerResponse | null>(null);
  const [createBannerError, setCreateBannerError] = useState<string | null>(null);

  // A6. 배너 수정
  const [bannerIdForUpdate, setBannerIdForUpdate] = useState('');
  const [updateBannerTitle, setUpdateBannerTitle] = useState('수정된 배너');
  const [updateBannerResult, setUpdateBannerResult] = useState<StoreBannerResponse | null>(null);
  const [updateBannerError, setUpdateBannerError] = useState<string | null>(null);

  // A7. 배너 삭제
  const [bannerIdForDelete, setBannerIdForDelete] = useState('');
  const [deleteBannerResult, setDeleteBannerResult] = useState<Record<string, unknown> | null>(null);
  const [deleteBannerError, setDeleteBannerError] = useState<string | null>(null);

  // A8. 배너 순서 변경
  const [bannerOrderIds, setBannerOrderIds] = useState('');
  const [reorderBannersResult, setReorderBannersResult] = useState<StoreBannerResponse[] | null>(null);
  const [reorderBannersError, setReorderBannersError] = useState<string | null>(null);

  // ── B. Catalog 상품 관리 ──

  // B1. 상품 기본정보 수정
  const [itemIdForUpdate, setItemIdForUpdate] = useState('');
  const [updateItemName, setUpdateItemName] = useState('');
  const [updateItemCategoryId, setUpdateItemCategoryId] = useState('');
  const [updateItemBasePrice, setUpdateItemBasePrice] = useState('');
  const [updateItemResult, setUpdateItemResult] = useState<ItemResponse | null>(null);
  const [updateItemError, setUpdateItemError] = useState<string | null>(null);

  // B2. 상품 상태 변경
  const [itemIdForStatus, setItemIdForStatus] = useState('');
  const [newItemStatus, setNewItemStatus] = useState<'ACTIVE' | 'INACTIVE'>('INACTIVE');
  const [statusResult, setStatusResult] = useState<ItemResponse | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  // B3. 상품 삭제 (soft delete)
  const [itemIdForDelete, setItemIdForDelete] = useState('');
  const [deleteItemResult, setDeleteItemResult] = useState<Record<string, unknown> | null>(null);
  const [deleteItemError, setDeleteItemError] = useState<string | null>(null);

  // B4. 이미지 목록 조회
  const [itemIdForImageList, setItemIdForImageList] = useState('');
  const [imageList, setImageList] = useState<ItemImageResponse[] | null>(null);
  const [imageListError, setImageListError] = useState<string | null>(null);

  // B5. 이미지 수정
  const [itemIdForImageUpdate, setItemIdForImageUpdate] = useState('');
  const [imageIdForUpdate, setImageIdForUpdate] = useState('');
  const [updateImageUrl, setUpdateImageUrl] = useState('');
  const [updateImageIsPrimary, setUpdateImageIsPrimary] = useState(false);
  const [updateImageAltText, setUpdateImageAltText] = useState('');
  const [updateImageResult, setUpdateImageResult] = useState<ItemImageResponse | null>(null);
  const [updateImageError, setUpdateImageError] = useState<string | null>(null);

  // B6. 이미지 삭제
  const [itemIdForImageDelete, setItemIdForImageDelete] = useState('');
  const [imageIdForDelete, setImageIdForDelete] = useState('');
  const [deleteImageResult, setDeleteImageResult] = useState<Record<string, unknown> | null>(null);
  const [deleteImageError, setDeleteImageError] = useState<string | null>(null);

  // B7. 이미지 순서 변경
  const [itemIdForImageOrder, setItemIdForImageOrder] = useState('');
  const [imageOrderIds, setImageOrderIds] = useState('');
  const [imageOrderResult, setImageOrderResult] = useState<ItemImageResponse[] | null>(null);
  const [imageOrderError, setImageOrderError] = useState<string | null>(null);

  const handleGetMe = async () => {
    setMeError(null);
    try {
      const res = await getMe();
      setMyUserId(res.data?.userId ?? null);
    } catch (err) {
      setMeError(err instanceof Error ? err.message : '내 정보 조회 실패');
    }
  };

  const handleGetStores = async () => {
    setStoresError(null);
    try {
      const list = await getStores();
      setStores(list);
      const mine = myUserId ? list.find((s) => s.ownerId === myUserId) : undefined;
      if (mine) setStoreId(String(mine.storeId));
    } catch (err) {
      setStoresError(err instanceof Error ? err.message : '스토어 목록 조회 실패');
    }
  };

  const handleCreateStore = async () => {
    setCreateStoreError(null);
    try {
      const store = await createStore({ name: newStoreName, description: '테스트용 스토어' });
      setCreatedStore(store);
      setStoreId(String(store.storeId));
    } catch (err) {
      setCreateStoreError(err instanceof Error ? err.message : '스토어 생성 실패');
    }
  };

  const handleGetCategories = async () => {
    setCategoriesError(null);
    try {
      const list = await getCategoriesByDepth();
      setCategories(list);
      if (list.length > 0) setCategoryId(String(list[0].id));
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : '카테고리 조회 실패');
    }
  };

  const handleCreateItem = async () => {
    setItemCreateError(null);
    try {
      const result = await createItem({
        storeId: Number(storeId),
        categoryId: Number(categoryId),
        name: itemName,
        basePrice: Number(basePrice),
        variants: [
          {
            sku,
            price: Number(variantPrice),
            initialQuantity: Number(initialQuantity),
            options: [{ type: optionType, value: optionValue }],
          },
        ],
      });
      setItemCreateResult(result);
      setItemIdForVariant(String(result.itemId));
      setItemIdForImage(String(result.itemId));
      setItemIdForCheck(String(result.itemId));
    } catch (err) {
      setItemCreateError(err instanceof Error ? err.message : '상품 생성 실패');
    }
  };

  const handleAddVariants = async () => {
    setAddVariantsError(null);
    try {
      const result = await addVariants(Number(itemIdForVariant), {
        variants: [
          {
            sku: addSku,
            price: Number(addPrice),
            initialQuantity: Number(addQuantity),
            options: [{ type: addOptionType, value: addOptionValue }],
          },
        ],
      });
      setAddVariantsResult(result);
    } catch (err) {
      setAddVariantsError(err instanceof Error ? err.message : 'Variant 추가 실패');
    }
  };

  const handleAddImage = async () => {
    setImageError(null);
    try {
      const result = await addImage(Number(itemIdForImage), {
        imageUrl,
        isPrimary,
        altText,
      });
      setImageResult(result);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '이미지 등록 실패');
    }
  };

  const handleGetItem = async () => {
    setFinalItemError(null);
    try {
      const result = await getItem(Number(itemIdForCheck));
      setFinalItem(result);
    } catch (err) {
      setFinalItemError(err instanceof Error ? err.message : '상품 조회 실패');
    }
  };

  // ── A. Store 관리 핸들러 ──

  const handleUpdateProfile = async () => {
    setProfileError(null);
    try {
      const result = await updateStoreProfile(Number(storeId), {
        description: profileDescription,
        notice: profileNotice,
        mainImageUrl: profileMainImageUrl,
      });
      setProfileResult(result);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : '프로필 수정 실패');
    }
  };

  const handleChangeOperationStatus = async () => {
    setOperationStatusError(null);
    try {
      const result = await changeOperationStatus(Number(storeId), { operationStatus });
      setOperationStatusResult(result);
    } catch (err) {
      setOperationStatusError(err instanceof Error ? err.message : '영업상태 변경 실패');
    }
  };

  const handleGetDeliveryPolicy = async () => {
    setDeliveryPolicyError(null);
    try {
      const result = await getDeliveryPolicy(Number(storeId));
      setDeliveryPolicyResult(result);
      setBaseDeliveryFee(String(result.baseDeliveryFee));
      setFreeDeliveryThreshold(result.freeDeliveryThreshold != null ? String(result.freeDeliveryThreshold) : '');
    } catch (err) {
      setDeliveryPolicyError(err instanceof Error ? err.message : '배송정책 조회 실패');
    }
  };

  const handleUpsertDeliveryPolicy = async () => {
    setDeliveryPolicyError(null);
    try {
      const result = await upsertDeliveryPolicy(Number(storeId), {
        baseDeliveryFee: Number(baseDeliveryFee),
        freeDeliveryThreshold: freeDeliveryThreshold ? Number(freeDeliveryThreshold) : undefined,
      });
      setDeliveryPolicyResult(result);
    } catch (err) {
      setDeliveryPolicyError(err instanceof Error ? err.message : '배송정책 등록/수정 실패');
    }
  };

  const handleGetBanners = async () => {
    setBannersError(null);
    try {
      const list = await getBanners(Number(storeId));
      setBanners(list);
    } catch (err) {
      setBannersError(err instanceof Error ? err.message : '배너 목록 조회 실패');
    }
  };

  const handleCreateBanner = async () => {
    setCreateBannerError(null);
    try {
      const result = await createBanner(Number(storeId), {
        imageUrl: bannerImageUrl,
        linkUrl: bannerLinkUrl,
        title: bannerTitle,
      });
      setCreateBannerResult(result);
      setBannerIdForUpdate(String(result.storeBannerId));
      setBannerIdForDelete(String(result.storeBannerId));
    } catch (err) {
      setCreateBannerError(err instanceof Error ? err.message : '배너 등록 실패');
    }
  };

  const handleUpdateBanner = async () => {
    setUpdateBannerError(null);
    try {
      const result = await updateBanner(Number(storeId), Number(bannerIdForUpdate), {
        title: updateBannerTitle,
      });
      setUpdateBannerResult(result);
    } catch (err) {
      setUpdateBannerError(err instanceof Error ? err.message : '배너 수정 실패');
    }
  };

  const handleDeleteBanner = async () => {
    setDeleteBannerError(null);
    try {
      await deleteBanner(Number(storeId), Number(bannerIdForDelete));
      setDeleteBannerResult({ deleted: true, storeId: Number(storeId), bannerId: Number(bannerIdForDelete) });
    } catch (err) {
      setDeleteBannerError(err instanceof Error ? err.message : '배너 삭제 실패');
    }
  };

  const handleReorderBanners = async () => {
    setReorderBannersError(null);
    try {
      const ids = bannerOrderIds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number);
      const result = await reorderBanners(Number(storeId), { bannerIds: ids });
      setReorderBannersResult(result);
    } catch (err) {
      setReorderBannersError(err instanceof Error ? err.message : '배너 순서 변경 실패');
    }
  };

  // ── B. Catalog 상품 관리 핸들러 ──

  const handleUpdateItem = async () => {
    setUpdateItemError(null);
    try {
      const result = await updateItem(Number(itemIdForUpdate), {
        name: updateItemName || undefined,
        categoryId: updateItemCategoryId ? Number(updateItemCategoryId) : undefined,
        basePrice: updateItemBasePrice ? Number(updateItemBasePrice) : undefined,
      });
      setUpdateItemResult(result);
    } catch (err) {
      setUpdateItemError(err instanceof Error ? err.message : '상품 수정 실패');
    }
  };

  const handleUpdateItemStatus = async () => {
    setStatusError(null);
    try {
      const result = await updateItemStatus(Number(itemIdForStatus), { status: newItemStatus });
      setStatusResult(result);
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : '상품 상태 변경 실패');
    }
  };

  const handleDeleteItem = async () => {
    setDeleteItemError(null);
    try {
      await deleteItem(Number(itemIdForDelete));
      setDeleteItemResult({ deleted: true, itemId: Number(itemIdForDelete) });
    } catch (err) {
      setDeleteItemError(err instanceof Error ? err.message : '상품 삭제 실패');
    }
  };

  const handleGetImages = async () => {
    setImageListError(null);
    try {
      const list = await getImages(Number(itemIdForImageList));
      setImageList(list);
    } catch (err) {
      setImageListError(err instanceof Error ? err.message : '이미지 목록 조회 실패');
    }
  };

  const handleUpdateImage = async () => {
    setUpdateImageError(null);
    try {
      const result = await updateImage(Number(itemIdForImageUpdate), Number(imageIdForUpdate), {
        imageUrl: updateImageUrl || undefined,
        isPrimary: updateImageIsPrimary,
        altText: updateImageAltText || undefined,
      });
      setUpdateImageResult(result);
    } catch (err) {
      setUpdateImageError(err instanceof Error ? err.message : '이미지 수정 실패');
    }
  };

  const handleDeleteImage = async () => {
    setDeleteImageError(null);
    try {
      await deleteImage(Number(itemIdForImageDelete), Number(imageIdForDelete));
      setDeleteImageResult({
        deleted: true,
        itemId: Number(itemIdForImageDelete),
        imageId: Number(imageIdForDelete),
      });
    } catch (err) {
      setDeleteImageError(err instanceof Error ? err.message : '이미지 삭제 실패');
    }
  };

  const handleUpdateImageOrder = async () => {
    setImageOrderError(null);
    try {
      const ids = imageOrderIds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number);
      const result = await updateImageOrder(Number(itemIdForImageOrder), { imageIds: ids });
      setImageOrderResult(result);
    } catch (err) {
      setImageOrderError(err instanceof Error ? err.message : '이미지 순서 변경 실패');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 48px 48px' }}>
      <div className="page-card" style={{ padding: 0, overflow: 'hidden', width: '800px', maxWidth: '100%' }}>
        <PageTitle title="Store/Catalog API 테스트" />

        <GroupHeading title="0~6. 카탈로그 등록 플로우" desc="로그인 → 내 스토어 조회 → 카테고리 조회 → 상품 생성 → variant 추가 → 이미지 등록 → 최종 상태 확인" />

        <ApiSection title="0. 내 정보 조회 (GET /users/me)">
          <div style={row}>
            <Button variant="secondary" onClick={handleGetMe} style={buttonStyle}>
              조회
            </Button>
            {myUserId !== null && <span style={{ fontSize: '13px', color: 'var(--color-gray-4)' }}>내 userId: {myUserId}</span>}
          </div>
          <ResultBox error={meError} result={null} />
        </ApiSection>

        <ApiSection title="1. 스토어 목록 조회 (GET /stores) → storeId 확보">
          <div style={row}>
            <Button variant="secondary" onClick={handleGetStores} style={buttonStyle}>
              조회
            </Button>
            <Field label="storeId">
              <input style={inputStyle} value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder="예: 1" />
            </Field>
          </div>
          <ResultBox error={storesError} result={stores} />

          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed var(--color-gray-2)' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-gray-4)', margin: '0 0 8px' }}>
              내 스토어가 없다면 아래에서 생성 (POST /stores)
            </p>
            <div style={row}>
              <Field label="스토어 이름">
                <input style={inputStyle} value={newStoreName} onChange={(e) => setNewStoreName(e.target.value)} />
              </Field>
              <Button variant="secondary" onClick={handleCreateStore} style={buttonStyle}>
                스토어 생성
              </Button>
            </div>
            <ResultBox error={createStoreError} result={createdStore} />
          </div>
        </ApiSection>

        <ApiSection title="2. 카테고리 조회 (GET /catalog/category) → categoryId 확보">
          <div style={row}>
            <Button variant="secondary" onClick={handleGetCategories} style={buttonStyle}>
              조회
            </Button>
            <Field label="categoryId">
              <input style={inputStyle} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} placeholder="예: 1" />
            </Field>
          </div>
          <ResultBox error={categoriesError} result={categories} />
        </ApiSection>

        <ApiSection title="3. 상품 생성 (POST /catalog/item) → itemId, itemVariantId 확보">
          <div style={row}>
            <Field label="상품명" width="220px">
              <input style={inputStyle} value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </Field>
            <Field label="기본가격">
              <input style={inputStyle} value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
            </Field>
          </div>
          <div style={row}>
            <Field label="SKU" width="200px">
              <input style={inputStyle} value={sku} onChange={(e) => setSku(e.target.value)} />
            </Field>
            <Field label="판매가격">
              <input style={inputStyle} value={variantPrice} onChange={(e) => setVariantPrice(e.target.value)} />
            </Field>
            <Field label="초기재고">
              <input style={inputStyle} value={initialQuantity} onChange={(e) => setInitialQuantity(e.target.value)} />
            </Field>
          </div>
          <div style={row}>
            <Field label="옵션 타입" width="120px">
              <select style={inputStyle} value={optionType} onChange={(e) => setOptionType(e.target.value as 'SIZE' | 'COLOR')}>
                <option value="COLOR">COLOR</option>
                <option value="SIZE">SIZE</option>
              </select>
            </Field>
            <Field label="옵션값">
              <input style={inputStyle} value={optionValue} onChange={(e) => setOptionValue(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={handleCreateItem} style={buttonStyle}>
              상품 생성
            </Button>
          </div>
          <ResultBox error={itemCreateError} result={itemCreateResult} />
        </ApiSection>

        <ApiSection title="4. Variant 추가 (POST /catalog/item/{itemId}/variants)">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForVariant} onChange={(e) => setItemIdForVariant(e.target.value)} placeholder="예: 1" />
            </Field>
          </div>
          <div style={row}>
            <Field label="SKU" width="200px">
              <input style={inputStyle} value={addSku} onChange={(e) => setAddSku(e.target.value)} />
            </Field>
            <Field label="판매가격">
              <input style={inputStyle} value={addPrice} onChange={(e) => setAddPrice(e.target.value)} />
            </Field>
            <Field label="초기재고">
              <input style={inputStyle} value={addQuantity} onChange={(e) => setAddQuantity(e.target.value)} />
            </Field>
          </div>
          <div style={row}>
            <Field label="옵션 타입" width="120px">
              <select style={inputStyle} value={addOptionType} onChange={(e) => setAddOptionType(e.target.value as 'SIZE' | 'COLOR')}>
                <option value="SIZE">SIZE</option>
                <option value="COLOR">COLOR</option>
              </select>
            </Field>
            <Field label="옵션값">
              <input style={inputStyle} value={addOptionValue} onChange={(e) => setAddOptionValue(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={handleAddVariants} style={buttonStyle}>
              Variant 추가
            </Button>
          </div>
          <ResultBox error={addVariantsError} result={addVariantsResult} />
        </ApiSection>

        <ApiSection title="5. 이미지 등록 (POST /catalog/item/{itemId}/images) → imageId 확보">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForImage} onChange={(e) => setItemIdForImage(e.target.value)} placeholder="예: 1" />
            </Field>
          </div>
          <div style={row}>
            <Field label="이미지 URL" width="320px">
              <input style={inputStyle} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </Field>
            <Field label="대체 텍스트">
              <input style={inputStyle} value={altText} onChange={(e) => setAltText(e.target.value)} />
            </Field>
          </div>
          <div style={row}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-gray-5)' }}>
              <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} /> 대표 이미지
            </label>
            <Button variant="primary" onClick={handleAddImage} style={buttonStyle}>
              이미지 등록
            </Button>
          </div>
          <ResultBox error={imageError} result={imageResult} />
        </ApiSection>

        <ApiSection title="6. 최종 상품 상태 확인 (GET /catalog/item/{itemId})">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForCheck} onChange={(e) => setItemIdForCheck(e.target.value)} placeholder="예: 1" />
            </Field>
            <Button variant="secondary" onClick={handleGetItem} style={buttonStyle}>
              조회
            </Button>
          </div>
          <ResultBox error={finalItemError} result={finalItem} />
        </ApiSection>

        <GroupHeading title="A. Store 관리 API" desc="storeId는 위 1번 단계에서 확보한 값을 재사용합니다" />

        <ApiSection title="A1. 스토어 프로필 수정 (PATCH /stores/{storeId}/profile)">
          <div style={row}>
            <Field label="소개" width="260px">
              <input style={inputStyle} value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} />
            </Field>
            <Field label="공지" width="200px">
              <input style={inputStyle} value={profileNotice} onChange={(e) => setProfileNotice(e.target.value)} />
            </Field>
          </div>
          <div style={row}>
            <Field label="대표 이미지 URL" width="320px">
              <input style={inputStyle} value={profileMainImageUrl} onChange={(e) => setProfileMainImageUrl(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={handleUpdateProfile} style={buttonStyle}>
              프로필 수정
            </Button>
          </div>
          <ResultBox error={profileError} result={profileResult} />
        </ApiSection>

        <ApiSection title="A2. 스토어 영업상태 변경 (PATCH /stores/{storeId}/operation-status)">
          <div style={row}>
            <Field label="영업상태" width="140px">
              <select style={inputStyle} value={operationStatus} onChange={(e) => setOperationStatus(e.target.value as 'OPEN' | 'CLOSED' | 'PAUSED')}>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="PAUSED">PAUSED</option>
              </select>
            </Field>
            <Button variant="primary" onClick={handleChangeOperationStatus} style={buttonStyle}>
              영업상태 변경
            </Button>
          </div>
          <ResultBox error={operationStatusError} result={operationStatusResult} />
        </ApiSection>

        <ApiSection title="A3. 배송정책 조회/등록수정 (GET, PUT /stores/{storeId}/delivery-policy)">
          <div style={row}>
            <Button variant="secondary" onClick={handleGetDeliveryPolicy} style={buttonStyle}>
              조회
            </Button>
          </div>
          <div style={row}>
            <Field label="기본 배송비">
              <input style={inputStyle} value={baseDeliveryFee} onChange={(e) => setBaseDeliveryFee(e.target.value)} />
            </Field>
            <Field label="무료배송 기준금액(선택)" width="180px">
              <input style={inputStyle} value={freeDeliveryThreshold} onChange={(e) => setFreeDeliveryThreshold(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={handleUpsertDeliveryPolicy} style={buttonStyle}>
              등록/수정
            </Button>
          </div>
          <ResultBox error={deliveryPolicyError} result={deliveryPolicyResult} />
        </ApiSection>

        <ApiSection title="A4. 배너 목록 조회 (GET /stores/{storeId}/banners)">
          <div style={row}>
            <Button variant="secondary" onClick={handleGetBanners} style={buttonStyle}>
              조회
            </Button>
          </div>
          <ResultBox error={bannersError} result={banners} />
        </ApiSection>

        <ApiSection title="A5. 배너 등록 (POST /stores/{storeId}/banners) → bannerId 확보">
          <div style={row}>
            <Field label="배너 이미지 URL" width="260px">
              <input style={inputStyle} value={bannerImageUrl} onChange={(e) => setBannerImageUrl(e.target.value)} />
            </Field>
            <Field label="클릭 시 이동 URL" width="220px">
              <input style={inputStyle} value={bannerLinkUrl} onChange={(e) => setBannerLinkUrl(e.target.value)} />
            </Field>
          </div>
          <div style={row}>
            <Field label="배너 제목">
              <input style={inputStyle} value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={handleCreateBanner} style={buttonStyle}>
              배너 등록
            </Button>
          </div>
          <ResultBox error={createBannerError} result={createBannerResult} />
        </ApiSection>

        <ApiSection title="A6. 배너 수정 (PATCH /stores/{storeId}/banners/{bannerId})">
          <div style={row}>
            <Field label="bannerId">
              <input style={inputStyle} value={bannerIdForUpdate} onChange={(e) => setBannerIdForUpdate(e.target.value)} placeholder="예: 1" />
            </Field>
            <Field label="수정할 제목" width="220px">
              <input style={inputStyle} value={updateBannerTitle} onChange={(e) => setUpdateBannerTitle(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={handleUpdateBanner} style={buttonStyle}>
              배너 수정
            </Button>
          </div>
          <ResultBox error={updateBannerError} result={updateBannerResult} />
        </ApiSection>

        <ApiSection title="A7. 배너 삭제 (DELETE /stores/{storeId}/banners/{bannerId})">
          <div style={row}>
            <Field label="bannerId">
              <input style={inputStyle} value={bannerIdForDelete} onChange={(e) => setBannerIdForDelete(e.target.value)} placeholder="예: 1" />
            </Field>
            <Button variant="secondary" onClick={handleDeleteBanner} style={buttonStyle}>
              배너 삭제
            </Button>
          </div>
          <ResultBox error={deleteBannerError} result={deleteBannerResult} />
        </ApiSection>

        <ApiSection title="A8. 배너 순서 변경 (PATCH /stores/{storeId}/banners/order)">
          <div style={row}>
            <Field label="정렬 순서대로 bannerId (쉼표 구분)" width="320px">
              <input style={inputStyle} value={bannerOrderIds} onChange={(e) => setBannerOrderIds(e.target.value)} placeholder="예: 3,1,2" />
            </Field>
            <Button variant="primary" onClick={handleReorderBanners} style={buttonStyle}>
              순서 변경
            </Button>
          </div>
          <ResultBox error={reorderBannersError} result={reorderBannersResult} />
        </ApiSection>

        <GroupHeading title="B. Catalog 상품 관리 API" />

        <ApiSection title="B1. 상품 기본정보 수정 (PATCH /catalog/item/{itemId})">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForUpdate} onChange={(e) => setItemIdForUpdate(e.target.value)} placeholder="예: 1" />
            </Field>
          </div>
          <div style={row}>
            <Field label="상품명(선택)" width="200px">
              <input style={inputStyle} value={updateItemName} onChange={(e) => setUpdateItemName(e.target.value)} />
            </Field>
            <Field label="categoryId(선택)">
              <input style={inputStyle} value={updateItemCategoryId} onChange={(e) => setUpdateItemCategoryId(e.target.value)} />
            </Field>
            <Field label="기본가격(선택)">
              <input style={inputStyle} value={updateItemBasePrice} onChange={(e) => setUpdateItemBasePrice(e.target.value)} />
            </Field>
            <Button variant="primary" onClick={handleUpdateItem} style={buttonStyle}>
              상품 수정
            </Button>
          </div>
          <ResultBox error={updateItemError} result={updateItemResult} />
        </ApiSection>

        <ApiSection title="B2. 상품 상태 변경 (PATCH /catalog/item/{itemId}/status)">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForStatus} onChange={(e) => setItemIdForStatus(e.target.value)} placeholder="예: 1" />
            </Field>
            <Field label="상태" width="140px">
              <select style={inputStyle} value={newItemStatus} onChange={(e) => setNewItemStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </Field>
            <Button variant="primary" onClick={handleUpdateItemStatus} style={buttonStyle}>
              상태 변경
            </Button>
          </div>
          <ResultBox error={statusError} result={statusResult} />
        </ApiSection>

        <ApiSection title="B3. 상품 삭제 (DELETE /catalog/item/{itemId}, soft delete)">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForDelete} onChange={(e) => setItemIdForDelete(e.target.value)} placeholder="예: 1" />
            </Field>
            <Button variant="secondary" onClick={handleDeleteItem} style={buttonStyle}>
              상품 삭제
            </Button>
          </div>
          <ResultBox error={deleteItemError} result={deleteItemResult} />
        </ApiSection>

        <ApiSection title="B4. 상품 이미지 목록 조회 (GET /catalog/item/{itemId}/images)">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForImageList} onChange={(e) => setItemIdForImageList(e.target.value)} placeholder="예: 1" />
            </Field>
            <Button variant="secondary" onClick={handleGetImages} style={buttonStyle}>
              조회
            </Button>
          </div>
          <ResultBox error={imageListError} result={imageList} />
        </ApiSection>

        <ApiSection title="B5. 상품 이미지 수정 (PATCH /catalog/item/{itemId}/images/{imageId})">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForImageUpdate} onChange={(e) => setItemIdForImageUpdate(e.target.value)} placeholder="예: 1" />
            </Field>
            <Field label="imageId">
              <input style={inputStyle} value={imageIdForUpdate} onChange={(e) => setImageIdForUpdate(e.target.value)} placeholder="예: 1" />
            </Field>
          </div>
          <div style={row}>
            <Field label="이미지 URL(선택)" width="260px">
              <input style={inputStyle} value={updateImageUrl} onChange={(e) => setUpdateImageUrl(e.target.value)} />
            </Field>
            <Field label="대체 텍스트(선택)">
              <input style={inputStyle} value={updateImageAltText} onChange={(e) => setUpdateImageAltText(e.target.value)} />
            </Field>
          </div>
          <div style={row}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-gray-5)' }}>
              <input type="checkbox" checked={updateImageIsPrimary} onChange={(e) => setUpdateImageIsPrimary(e.target.checked)} /> 대표
              이미지로 설정
            </label>
            <Button variant="primary" onClick={handleUpdateImage} style={buttonStyle}>
              이미지 수정
            </Button>
          </div>
          <ResultBox error={updateImageError} result={updateImageResult} />
        </ApiSection>

        <ApiSection title="B6. 상품 이미지 삭제 (DELETE /catalog/item/{itemId}/images/{imageId})">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForImageDelete} onChange={(e) => setItemIdForImageDelete(e.target.value)} placeholder="예: 1" />
            </Field>
            <Field label="imageId">
              <input style={inputStyle} value={imageIdForDelete} onChange={(e) => setImageIdForDelete(e.target.value)} placeholder="예: 1" />
            </Field>
            <Button variant="secondary" onClick={handleDeleteImage} style={buttonStyle}>
              이미지 삭제
            </Button>
          </div>
          <ResultBox error={deleteImageError} result={deleteImageResult} />
        </ApiSection>

        <ApiSection title="B7. 상품 이미지 순서 변경 (PATCH /catalog/item/{itemId}/images/order)">
          <div style={row}>
            <Field label="itemId">
              <input style={inputStyle} value={itemIdForImageOrder} onChange={(e) => setItemIdForImageOrder(e.target.value)} placeholder="예: 1" />
            </Field>
          </div>
          <div style={row}>
            <Field label="정렬 순서대로 imageId (쉼표 구분)" width="320px">
              <input style={inputStyle} value={imageOrderIds} onChange={(e) => setImageOrderIds(e.target.value)} placeholder="예: 3,1,4,2" />
            </Field>
            <Button variant="primary" onClick={handleUpdateImageOrder} style={buttonStyle}>
              순서 변경
            </Button>
          </div>
          <ResultBox error={imageOrderError} result={imageOrderResult} />
        </ApiSection>
      </div>
    </div>
  );
}
