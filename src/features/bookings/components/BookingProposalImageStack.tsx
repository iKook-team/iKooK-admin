import React from 'react';
import Constants from '../../../utils/constants';

interface Proposal {
  photo: string;
  username: string;
}

interface ProposalImageStackProps {
  proposalList: Proposal[];
}

const ProposalImageStack: React.FC<ProposalImageStackProps> = ({ proposalList }) => {
  if (proposalList.length === 0) return null;

  return proposalList.length === 1 ? (
    <img
      src={`${Constants.userUrl}/${proposalList[0].photo}`}
      alt={proposalList[0].username}
      className="w-6 aspect-square rounded-full"
    />
  ) : proposalList.length === 2 ? (
    <div className="flex items-center relative">
      {proposalList.map((proposal, index) => (
        <img
          key={index}
          src={`${Constants.userUrl}/${proposal.photo}`}
          alt={proposal.username}
          className={`w-6 h-6 rounded-full absolute ${
            index === 0 ? 'left-0' : 'left-4'
          } z-${index + 25} ring-1 ring-white`}
        />
      ))}
    </div>
  ) : (
    <div className="flex flex-row items-center relative">
      {proposalList.slice(0, 2).map((proposal, index) => (
        <img
          key={index}
          src={`${Constants.userUrl}/${proposal.photo}`}
          alt={proposal.username}
          className={`w-6 h-6 rounded-full absolute ${
            index === 0 ? 'left-0' : 'left-4'
          } z-${index + 25} ring-1 ring-white`}
        />
      ))}
      <div className="flex bg-gray-200 h-6 w-6 rounded-full absolute left-8 z-30 items-center justify-center">
        <h2 className="text-black-base text-xs">{`+${proposalList.length - 2}`}</h2>
      </div>
    </div>
  );
};

export default ProposalImageStack;
