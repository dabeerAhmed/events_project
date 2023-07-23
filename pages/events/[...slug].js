import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getFilteredEvents } from "../../helper/api-util";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import { Fragment } from "react";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
import Head from "next/head";
function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState();
  const Router = useRouter();
  const filterData = Router.query.slug;

  const { data, error } = useSWR(
    "https://next-mod-5-default-rtdb.firebaseio.com/events.json",
    (url) => fetch(url).then((res) => res.json())
  );
  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }
      setLoadedEvents(events);
    }
  }, [data]);

  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content="A list of filtered events"
      />
    </Head>
  );

  if (!loadedEvents) {
    {
      pageHeadData;
    }
    return <p className="center">Loading...</p>;
  }

  const FilteredYear = filterData[0];
  const FilteredMonth = filterData[1];

  const numYear = +FilteredYear;
  const numMonth = +FilteredMonth;

  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`Filtered Events for ${numMonth}/${numYear}`}
      />
    </Head>
  );

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12 ||
    error
  ) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid Filter. Please adjust your values</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events Found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth - 1);
  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const { params } = context;

//   const filterData = params.slug;

//   const FilteredYear = filterData[0];
//   const FilteredMonth = filterData[1];

//   const numYear = +FilteredYear;
//   const numMonth = +FilteredMonth;

//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2030 ||
//     numYear < 2021 ||
//     numMonth < 1 ||
//     numMonth > 12
//   ) {
//     return {
//       props: {
//         hasError: true,
//         // notfound: true,
//         // redirect: {
//         //   destination:'/error'
//         // }
//       },
//     };
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth,
//   });
//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         year: numYear,
//         month: numMonth,
//       },
//     },
//   };
// }
export default FilteredEventsPage;
