import { Ref, useCallback, useRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { useFetchMenuQuery, useUpdateMenuStatus } from '../domain/usecase.ts';
import PageLoading from '../../../app/components/page/PageLoading.tsx';
import { MenuCategory } from '../data/model.ts';
import { ReactSVG } from 'react-svg';
import checkbox from '../../../app/assets/icons/checkbox.svg';
import Constants from '../../../utils/constants.ts';
import { formatCurrency } from '../../../utils/formatter.ts';
import ImageViewerModal from '../../../app/components/ImageViewerModal.tsx';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import ChangeMenuStatusModal from './ChangeMenuStatusModal.tsx';
import { toast } from 'react-toastify';
import { getCurrentFromRef } from '../../../utils/ref.ts';

interface MenuDetailsModalProps {
  id: string;
  ref: Ref<HTMLDialogElement>;
}

export default function MenuDetailsModal({ id, ref }: MenuDetailsModalProps) {
  const { isPending, data, error } = useFetchMenuQuery(id);
  const mutation = useUpdateMenuStatus();
  const [selectedImage, setSelectedImage] = useState<string>();
  const imageDialogRef = useRef<HTMLDialogElement>(null);
  const changeStatusRef = useRef<HTMLDialogElement>(null);

  const showImage = useCallback((src: string) => {
    setSelectedImage(src);
    imageDialogRef.current?.showModal();
  }, []);

  const approveMenu = useCallback(() => {
    mutation
      .mutateAsync({
        menuId: id,
        status: 'approve'
      })
      .then(() => {
        toast('Menu approved successfully', { type: 'success' });
        getCurrentFromRef(ref)?.close();
      });
  }, [id, mutation, ref]);

  const rejectMenu = useCallback(() => {
    changeStatusRef.current?.showModal();
  }, [changeStatusRef]);

  return (
    <>
      <PageModal
        ref={ref}
        id="menu-details-modal"
        title="Menu Details"
        className="lg:min-w-[60rem]"
      >
        {error ? (
          <p className="text-center">{error.message}</p>
        ) : isPending ? (
          <PageLoading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-7">
            <div>
              <div className="bg-soft-cream p-2.5 rounded-md flex flex-col gap-6">
                <MenuCategoryItem title="Starter" {...data?.starter_menu} />
                <MenuCategoryItem title="Main" {...data?.main_menu} />
                <MenuCategoryItem title="Dessert" {...data?.dessert_menu} />
                <MenuCategoryItem title="Side" {...data?.side_menu} />
              </div>
              <div className="mt-6 flex flex-row gap-3 overflow-x-auto no-scrollbar">
                {data?.images?.map((image, index) => (
                  <MenuImage key={index} src={image} onClick={(src) => showImage(src)} />
                ))}
              </div>
            </div>
            <div className="border border-black-100 shadow-md rounded-2xl px-7 pt-8 pb-11 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <MenuEntryItem title="Menu name" value={data?.menu_name} />
                <MenuEntryItem
                  title="Price"
                  value={formatCurrency(data?.menu_price, data?.currency)}
                />
                <MenuEntryItem
                  title="Minimum number of quests"
                  value={data?.minimum_number_of_guest}
                />
                <MenuEntryItem title="Maximum menu selection" value={data?.max_menu_selection} />
                <MenuEntryItem title="Event types" value={data?.event} />
                <MenuEntryItem title="Cuisine types" value={data?.cuisine} />
              </div>
              <div className="flex flex-col pt-6 gap-3.5 mt-auto">
                <button
                  className="btn btn-primary"
                  disabled={mutation.isPending || data?.status === 'approved'}
                  onClick={approveMenu}
                >
                  <LoadingSpinner isLoading={mutation.isPending}>Approve menu</LoadingSpinner>
                </button>
                <button
                  className="btn btn-ghost border-silver-american"
                  disabled={mutation.isPending || data?.status === 'unapproved'}
                  onClick={rejectMenu}
                >
                  Reject menu
                </button>
              </div>
            </div>
          </div>
        )}
      </PageModal>
      <ImageViewerModal ref={imageDialogRef} src={selectedImage} alt="menu" />
      <ChangeMenuStatusModal
        ref={changeStatusRef}
        menu={
          data
            ? {
                id,
                chefUsername: data.chef.username,
                name: data.menu_name
              }
            : undefined
        }
        initialState={{
          status: 'unapprove',
          reason: ''
        }}
        onDone={() => getCurrentFromRef(ref)?.close()}
      />
    </>
  );
}

function MenuCategoryItem(props: MenuCategory & { title: string }) {
  if (!props || props.menu.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-black-base">
        {props.title} x{props.menu_selection}
      </h3>
      <div className="mt-4">
        {props.menu.map((item) => (
          <div key={item._id} className="flex gap-3 items-center">
            <ReactSVG src={checkbox} className="w-5 h-5" />
            <p className="text-base text-black-olive">{item.menuName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuImage({ src, onClick }: { src: string; onClick: (src: string) => void }) {
  const image = Constants.getAssetUrl(src, 'menus');
  return (
    <div
      className="flex-shrink-0 max-w-[9.375rem] aspect-square relative"
      onClick={image ? () => onClick(image) : undefined}
    >
      <img src={image} alt="menu" className="w-full h-full rounded-2xl object-cover block" />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-black-base/25 to-black-base/50 rounded-2xl" />
    </div>
  );
}

function MenuEntryItem(props: { title: string; value: string | string[] | number }) {
  return (
    <div className="flex flex-col gap-1">
      <h6 className="text-xs text-blue-dark-electric">{props.title}</h6>
      {Array.isArray(props.value) ? (
        <div className="flex flex-row gap-1 items-center overflow-x-auto">
          {props.value.map((value) => (
            <p
              key={value}
              className="text-xs text-black-base py-1 px-2.5 bg-soft-cream border border-hard-cream rounded-full capitalize"
            >
              {value}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-dark-charcoal">{props.value}</p>
      )}
    </div>
  );
}
