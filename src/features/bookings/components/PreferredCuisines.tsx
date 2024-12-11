import { ListTile, RowList } from "./RoundedRowList";


type PreferredCuisinesProp = {
  message : string;
    cuisines: string[];
    eventType : string,
    allergies : string[],
  };

  

export default function PreferredCuisines({ cuisines, eventType, allergies, message }: PreferredCuisinesProp): JSX.Element {
  return (
    <div className="flex flex-col justify-around">
      <div className="flex flex-col gap-2 my-5">
        <RowList title="Preferred Cuisines" list={cuisines} />

        <RowList title="Event Type" list={[eventType]} />

        <RowList title="Allergies" list={allergies} />
      </div>
      <div className="flex flex-col gap-10  my-2">
        <ListTile
          title="Allergies Information"
          subtitle="I don't really have an allergy and my attendees don't have any"
        />

        <ListTile title="Message to chef" subtitle= {message}/>
      </div>
    </div>
  );
}
