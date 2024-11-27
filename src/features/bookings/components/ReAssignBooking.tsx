import { useFetchUsersQuery, useReassignBooking } from '../domain/usecase';
import { FaSearch } from 'react-icons/fa';
import InputField from '../../../app/components/InputField';
import { useState } from 'react';


interface ReAssignBookingProps {
  bookingId: string;
  closeModal: () => void
}

const ReAssignSearchComponent: React.FC <ReAssignBookingProps> = ({bookingId, closeModal}) => {
  const { isPending: loadingChefs, users, error, query, setQuery } = useFetchUsersQuery();

  const { performReassign, loading: reassignLoading } = useReassignBooking();
  
  const [chefId , setChefId] = useState("");

  return (
    <div>
      <div>Select Chef</div>
      <InputField
        className="w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name of Chef"
        trailing={<FaSearch />}
      />
      {loadingChefs && <span className="loading loading-dots loading-lg"></span>}
      {error && <p>{error.message}</p>}

      <ul className="mt-2">
        {users.map((chef, index) => (


          <li key={index}>
            <div
              className="text-center border border-black bg-primary mb-1 font-bold cursor-pointer hover:bg-gray-100"
              onClick={() => {setQuery(chef.first_name + " " + chef.last_name);
                        setChefId(chef.id);
                        console.log("set chef id ")
              } }
              >
              {chef.last_name} {chef.first_name}
            </div>
          </li> 
        ))}
      </ul>

      <button
        disabled={reassignLoading}
        onClick={
          () => {
            performReassign({ chefId: chefId, bookingId: bookingId }).then(() =>
              closeModal()
            );
          } 
        }
        className="btn btn-primary flex mx-auto mt-3 w-32"
      >
        {reassignLoading ? 'Assigning' : 'Assign'}
      </button>
    </div>
  );
};

export default ReAssignSearchComponent;
