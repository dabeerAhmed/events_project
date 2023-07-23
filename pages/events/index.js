import EventList from "../../components/events/event-list";
import { getAllEvents } from "../../helper/api-util";
import EventSearch from "../../components/events/events-search";
import { Fragment } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
function AllEventsPage(props) {
  const events = props.events;
  const router = useRouter();

  function FindEventHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }

  return (
    <Fragment>
      <Head>
        <title>All Events</title>
        <meta name="description" content="Find a lot of great events that allow you to evolve"/>
      </Head>
      <EventSearch onSearch={FindEventHandler} />
      <EventList items={events} />
    </Fragment>
  );
}

export async function getStaticProps() {
  const events = await getAllEvents();
  return {
    props: {
      events: events,
    },
    revalidate: 60,
  };
}

export default AllEventsPage;
