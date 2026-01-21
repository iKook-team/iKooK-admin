import { Ref, useCallback, useRef, useState } from 'react';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { useFetchMenuQuery, useUpdateMenu } from '../domain/usecase.ts';
import PageLoading from '../../../app/components/page/PageLoading.tsx';
import { MenuCourse, MenuItem, MenuStatus } from '../data/model.ts';
import { ReactSVG } from 'react-svg';
import checkbox from '../../../app/assets/icons/checkbox.svg';
import { formatCurrency } from '../../../utils/helper.ts';
import ImageViewerModal from '../../../app/components/ImageViewerModal.tsx';
import { LoadingSpinner } from '../../../app/components/LoadingSpinner.tsx';
import ChangeMenuStatusModal from './ChangeMenuStatusModal.tsx';
import { getCurrentFromRef } from '../../../utils/ref.ts';
import MenuImage from './MenuImage.tsx';

interface MenuDetailsModalProps {
  slug?: string;
  ref: Ref<HTMLDialogElement>;
}

export default function MenuDetailsModal({ slug, ref }: MenuDetailsModalProps) {
  const { isPending, data, error } = useFetchMenuQuery(slug);
  const mutation = useUpdateMenu(ref);
  const [selectedImage, setSelectedImage] = useState<string>();
  const imageDialogRef = useRef<HTMLDialogElement>(null);
  const changeStatusRef = useRef<HTMLDialogElement>(null);

  const showImage = useCallback((src: string) => {
    setSelectedImage(src);
    imageDialogRef.current?.showModal();
  }, []);

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
                {Object.values(MenuCourse).map((course) => (
                  <MenuCategoryItem
                    key={course}
                    title={course}
                    items={data?.items.filter((item) => item.course === course)}
                  />
                ))}
              </div>
              <div className="mt-6 flex flex-row gap-3 overflow-x-auto no-scrollbar">
                {data?.images?.map(({ image }, index) => (
                  <MenuImage key={index} src={image} onClick={(src) => showImage(src)} />
                ))}
              </div>
            </div>
            <div className="border border-black-100 shadow-md rounded-2xl px-7 pt-8 pb-11 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <MenuEntryItem title="Menu name" value={data?.name} />
                <MenuEntryItem
                  title="Price"
                  value={formatCurrency(data?.price_per_person, data?.currency)}
                />
                <MenuEntryItem title="Minimum number of quests" value={data?.num_of_guests} />
                <MenuEntryItem title="Maximum menu selection" value={data?.max_menu_selection} />
                <MenuEntryItem title="Event types" value={data?.event_types} />
                <MenuEntryItem title="Cuisine types" value={data?.cuisine_types} />
              </div>
              <div className="flex flex-col pt-6 gap-3.5 mt-auto">
                <button
                  className="btn btn-primary"
                  disabled={mutation.isPending || data?.status === MenuStatus.active}
                  onClick={() => mutation.mutate({ slug: slug!, data: { status: MenuStatus.active } })}
                >
                  <LoadingSpinner isLoading={mutation.isPending}>Approve menu</LoadingSpinner>
                </button>
                <button
                  className="btn btn-ghost border-silver-american"
                  disabled={mutation.isPending || data?.status !== MenuStatus.pending}
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
        menu={data}
        initialState={{
          status: MenuStatus.pending,
          reason: ''
        }}
        onDone={() => getCurrentFromRef(ref)?.close()}
      />
    </>
  );
}

function MenuCategoryItem(props: { title: string; items: MenuItem[] }) {
  if (!props || props.items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-black-base">
        {props.title} x{props.items.length}
      </h3>
      <div className="mt-4">
        {props.items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <ReactSVG src={checkbox} className="w-5 h-5" />
            <p className="text-base text-black-olive">{item.name}</p>
          </div>
        ))}
      </div>
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
