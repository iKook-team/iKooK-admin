import { Ref } from 'react';
import { Report } from '../data/model.ts';
import PageModal from '../../../app/components/page/PageModal.tsx';
import { ReportType } from '../domain/types.ts';
import { User } from '../../users/data/model.ts';
import UsernameAndImage from '../../users/components/UsernameAndImage.tsx';
import EmptyCell from '../../../app/components/EmptyCell.tsx';

interface ReportDetailsModalProps {
  ref: Ref<HTMLDialogElement>;
  data?: Report;
  type: ReportType;
}

export default function ReportDetailsModal({ ref, data, type }: ReportDetailsModalProps) {
  return (
    <PageModal
      ref={ref}
      id="report-details-modal"
      title={`${type === ReportType.chef ? 'Chef' : 'Menu'} Report Details`}
      className="lg:min-w-[26rem]"
    >
      <div className={`flex flex-col ${type === ReportType.chef ? 'gap-6' : 'gap-4'}`}>
        <div className="flex gap-8">
          <UserEntry title="Reporter" user={data?.reported_by} />
          <UserEntry title="Chef" user={data?.chef ?? data?.menu?.chef} />
        </div>
        {type === ReportType.menu && (
          <div className="flex flex-col gap-1">
            <p className="text-blue-dark-electric text-sm">Menu</p>
            <p className="text-base text-black-olive">{data?.menu?.menu_name}</p>
          </div>
        )}
        <div className={`flex flex-col ${type === ReportType.chef ? 'gap-3' : 'gap-2'}`}>
          <p className="text-charcoal text-base font-medium">Report</p>
          <p className="text-sm text-silver-dark">{data?.reason}</p>
        </div>
      </div>
    </PageModal>
  );
}

function UserEntry({ title, user }: { title: string; user?: User }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-blue-dark-electric text-sm">{title}</p>
      {user ? (
        <UsernameAndImage name={`${user?.first_name} ${user?.last_name}`} image={user?.photo} />
      ) : (
        <EmptyCell />
      )}
    </div>
  );
}
