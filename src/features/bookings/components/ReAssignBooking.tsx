import React, { useState, useEffect } from 'react';
import { useReassignBooking } from '../domain/usecase';
import { FaSearch } from 'react-icons/fa';
import InputField from '../../../app/components/InputField';

const ReAssignSearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(''); // User input
  const [results, setResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state

  // Debounce logic to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`admin/get-all-users?user_type=chef`);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setResults(data); // Assuming the API returns a list of results
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchSearchResults, 500);

  useEffect(() => {
    debouncedFetch(searchQuery);
  }, [searchQuery]);

  const { performReassign, loading: reassignLoading } = useReassignBooking();

  return (
    <div>
      <div>Select Chef</div>
      <InputField
        className="w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name of Chef"
        trailing={<FaSearch />}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((result: any, index: number) => (
          <li key={index}>{result.name}</li> // Replace 'name' with the appropriate key from your API response
        ))}
      </ul>

      <button
        disabled={reassignLoading}
        onClick={
          () => {
            performReassign({ chefId: 'currentChefId', bookingId: 'currentBookingId' }).then(() =>
              // closeModal()
              console.log('close modal')
            );
          } // come back to provide chefId
        }
        className="btn btn-primary flex mx-auto mt-3 w-32"
      >
        {reassignLoading ? 'Assigning' : 'Assign'}
      </button>
    </div>
  );
};

export default ReAssignSearchComponent;
