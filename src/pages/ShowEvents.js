import SearchEvents from "../components/SearchEvents";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

// This will be the page on the wireframe that displays all of the events. The search bar, event cards, the map plugin, and the categories
//  will be their own components.
// Should the sort button also be its own component?
// Since the categories will double as clickable filters should they even be their own components?
// There will also be an axios call fetching all events once the backend and frontend are connected
// Create event button will ink to new event page once routes are setup
export default function ShowEvents() {
  return (
    <div>
      <SearchEvents />
      <Link to={"/events/new"}>
        <button>Create Event</button>
      </Link>
      <button>Sort by</button>
      <EventCard />
    </div>
  );
}
