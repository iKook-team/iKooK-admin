import PageTitle from '../../app/components/page/PageTitle.tsx';
import InputField, { DropdownField } from '../../app/components/InputField.tsx';
import { CURRENCIES } from '../../utils/formatter.ts';
import { useCreateGiftCard } from './domain/usecase.ts';
import { LoadingSpinner } from '../../app/components/LoadingSpinner.tsx';

export default function CreateGiftScreen() {
  const { state, setState, isPending, submit } = useCreateGiftCard();
  return (
    <div className="max-w-[50rem]">
      <PageTitle title="Create Gift" />
      <DropdownField
        label="Currency"
        placeholder="Select currency"
        options={CURRENCIES}
        className="mt-4"
        value={state.currency}
        onChange={(e) => setState((state) => ({ ...state, currency: e.target.value }))}
      />
      <InputField
        label="Amount"
        placeholder="Enter amount"
        type="number"
        className="mt-4"
        value={state.amount}
        onChange={(e) => setState((state) => ({ ...state, amount: Number(e.target.value) }))}
      />
      <button
        className="btn btn-primary w-fit mt-[3.3125rem]"
        onClick={submit}
        disabled={isPending}
      >
        <LoadingSpinner isLoading={isPending}>Save Changes</LoadingSpinner>
      </button>
    </div>
  );
}
