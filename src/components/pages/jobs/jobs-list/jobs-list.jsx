import React, { useState, useEffect } from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

const JobsList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`https://boards-api.greenhouse.io/v1/boards/neondatabase/jobs?content=true`)
      .then((response) => response.json())
      .then(({ jobs }) => {
        const jobsByDepartmentAsObject = {};

        jobs.forEach(({ title, location, departments, absolute_url }) => {
          departments.forEach(({ name }) => {
            if (!jobsByDepartmentAsObject[name]) jobsByDepartmentAsObject[name] = [];
            jobsByDepartmentAsObject[name].push({
              name: title,
              location: location.name,
              url: absolute_url,
            });
          });
        });

        const jobsByDepartmentAsArray = Object.keys(jobsByDepartmentAsObject).map((department) => ({
          name: department,
          items: jobsByDepartmentAsObject[department],
        }));

        setItems(jobsByDepartmentAsArray);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <section className="safe-paddings pt-64 3xl:pt-60 2xl:pt-52 xl:pt-48 lg:pt-40 md:pt-32">
      <Container size="sm">
        <h2 className="t-5xl font-bold">Job Openings</h2>
        <ul className="mt-14 space-y-16 lg:mt-10 lg:space-y-12 md:mt-6 md:space-y-8">
          {items.map(({ name, items }, index) => (
            <li key={index}>
              <h3 className="t-3xl font-bold">{name}</h3>
              <ul className="mt-7 2xl:mt-6 xl:mt-5">
                {items.map(({ name, location, url }, index) => (
                  <li
                    className="border-t border-t-gray-3 last:border-b last:border-b-gray-3"
                    key={index}
                  >
                    <Link
                      className="group flex items-center justify-between py-4 md:py-3"
                      to={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="t-xl font-semibold !leading-snug transition-colors duration-200 group-hover:text-primary-2">
                        {name}
                      </span>
                      <span className="t-base ml-4 rounded-full bg-secondary-2 py-2 px-4 font-semibold md:ml-2 md:px-2.5">
                        {location}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default JobsList;
