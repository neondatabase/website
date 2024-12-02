'use client';

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

        jobs.forEach(({ title, location, departments, absolute_url: absoluteUrl }) => {
          departments.forEach(({ name }) => {
            if (!jobsByDepartmentAsObject[name]) jobsByDepartmentAsObject[name] = [];
            jobsByDepartmentAsObject[name].push({
              name: title,
              location: location.name,
              url: absoluteUrl,
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
    <section className="safe-paddings pt-24 lg:pt-16 md:pt-12">
      <Container size="xs">
        <h2 className="t-5xl font-title font-medium leading-tight">Job Openings</h2>
        <ul className="mb-16 mt-14 space-y-16 lg:mb-12 lg:mt-10 lg:space-y-12 md:mb-8 md:mt-6 md:space-y-8">
          {items.map(({ name, items }, index) => (
            <li key={index}>
              <h3 className="t-3xl font-bold leading-none">{name}</h3>
              <ul className="mt-7 2xl:mt-6 xl:mt-5">
                {items.map(({ name, location, url }, index) => (
                  <li
                    className="border-t border-t-gray-6 last:border-b last:border-b-gray-6"
                    key={index}
                  >
                    <Link
                      className="group flex items-center justify-between py-4 md:py-3"
                      to={url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="t-xl font-semibold leading-snug transition-colors duration-200 group-hover:text-primary-2">
                        {name}
                      </span>
                      <span className="t-base ml-4 rounded-full bg-secondary-2 px-4 py-2 font-semibold leading-snug md:ml-2 md:px-2.5">
                        {location}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <span className="text-xl md:text-base">
          By applying for the position, you agree to our{' '}
          <Link className="font-semibold" to="/candidate-privacy-policy/" theme="black-primary-1">
            Candidate Privacy Policy.
          </Link>
        </span>
      </Container>
    </section>
  );
};

export default JobsList;
