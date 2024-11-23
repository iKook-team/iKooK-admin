import { getImageUrl } from '../../../utils/getImageUrl';
import { Quote } from '../data/model';
import Constants from '../../../utils/constants';

interface QuoteCardGridProps {
  quotesList: Quote[];
  viewQuote: () => void;
  setCurrentQuote: (quote: Quote) => void; 
}

const QuoteCardGrid: React.FC<QuoteCardGridProps> = ({
  quotesList,
  viewQuote,
  setCurrentQuote
}) => {
  function viewQuoteSetId(quote: Quote) {
    viewQuote();
    setCurrentQuote(quote);
  }

  return (
    <div
      className={`flex flex-col md:flex-col xl:grid gap-4 ${quotesList.length > 1 ? 'xl:grid-cols-2' : 'place-items-center'}`}
    >
      {quotesList.map((quote, index) => (
        <div
          key={index}
          className="border border-gray-200 h-max lg:h-min aspect-[400/302] flex flex-col rounded-xl relative"
        >
          {/* Image Section */}
          <div className="h-[60%]">
            <img
              className="h-full w-full object-fill rounded-t-xl"
              src={`${Constants.userUrl}/${quote.image}`}
              alt=""
            />
          </div>

          {/* Content Section */}
          <div className="h-[40%] p-3 mb-2">
            <h1 className="font-bold text-lg mb-3">{quote.menuName}</h1>
            <div className="flex justify-between items-center">
              <div>
                <h1>Total Cost</h1>
                <h1 className="font-bold text-3xl">
                  {quote.currency}
                  {quote.amount}
                </h1>
              </div>
              <div className="w-min ">
                <button
                  onClick={() => viewQuoteSetId(quote)}
                  className="border border-gray-500 px-5  h-12"
                >
                  View quote
                </button>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute left-5 top-5 bg-white px-4 py-2 rounded-3xl">
            <h1>Wedding</h1>
          </div>

          {/* Image with Border */}
          <div className="h-12 w-14 right-5 bottom-28 rounded-3xl absolute border-2 border-white">
            <img
              className="h-full w-full rounded-3xl object-cover"
              src={`${Constants.userUrl}/${quote.chef.profile_picture}`}
              alt=""
            />
          </div>

          {/* Icon */}
          <div className="absolute right-[22px] bottom-[112px] w-4">
            <img className="w-full" src={getImageUrl('icons/quote-check.svg')} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuoteCardGrid;
