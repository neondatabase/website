import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import ChevronIcon from 'components/pages/partners/apply/images/chevron.inline.svg';
import closeSvg from 'components/pages/partners/apply/images/close.svg';
import Button from 'components/shared/button/button';

const applicationScopeOptions = [
  { id: 'create_projects', name: 'Create projects' },
  { id: 'read_projects', name: 'Read projects' },
  { id: 'modify_projects', name: 'Modify projects' },
  { id: 'delete_projects', name: 'Delete projects' },
];

const MultiSelect = ({ control, setValue }) => {
  const [applicationScopes, setApplicationScopes] = useState([]);
  return (
    <Combobox
      className="relative mt-1"
      as="div"
      value={applicationScopes}
      multiple
      onChange={setApplicationScopes}
    >
      <Combobox.Label>What application scope would you need?</Combobox.Label>
      <div className="relative mt-3 flex min-h-[40px] w-full appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 py-[7px] caret-transparent transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15">
        {applicationScopes?.length > 0 && (
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {applicationScopes.map((item) => (
              <li
                className="relative z-10 flex items-center gap-x-1 rounded-[20px] bg-green-45 py-[5px] pl-2.5 pr-[7px] font-medium leading-none text-black-new"
                key={item.id}
              >
                <span className="text-sm leading-none">{item.name}</span>
                <Button
                  className="flex h-3.5 w-3.5 items-center"
                  aria-label="Remove"
                  onClick={() =>
                    setApplicationScopes((prev) =>
                      prev.filter((prevItem) => prevItem.id !== item.id)
                    )
                  }
                >
                  <img src={closeSvg} alt="" width={8} height={14} loading="lazy" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Combobox.Input
          className={clsx('pointer-events-none absolute inset-0 opacity-0 focus:outline-none')}
          disabled
        />
        <Combobox.Button className="absolute right-0 top-1/2 flex h-full w-full -translate-y-1/2 items-center justify-end pr-4">
          <ChevronIcon className="h-4 w-4" />
        </Combobox.Button>
      </div>
      <Combobox.Options className="absolute top-full z-10 mt-1.5 flex w-full flex-col gap-y-3 rounded border border-gray-new-15 bg-[#1c1d1e] p-4">
        {applicationScopeOptions.map((item) => (
          <Combobox.Option
            className="cursor-pointer text-sm leading-none transition-colors duration-200 hover:text-green-45 ui-active:text-green-45"
            key={item.id}
            as="fieldset"
            value={item}
          >
            <label
              className="flex cursor-pointer items-center gap-x-2"
              htmlFor={`option-${item.id}`}
            >
              <Controller
                control={control}
                name="application_scope"
                render={({ field: { onChange, value } }) => (
                  <input
                    className="h-3.5 w-3.5 appearance-none rounded-sm border border-gray-new-40 bg-[length:10px_10px] bg-center bg-no-repeat transition-colors duration-200 checked:border-green-45 checked:bg-green-45 checked:bg-[url(/images/check.svg)] focus:outline-none"
                    type="checkbox"
                    value={value}
                    defaultChecked={applicationScopes?.some((i) => i.id === item?.id)}
                    id={`option-${item.id}`}
                    onChange={(e) => {
                      onChange(e);
                      if (e.target.checked) {
                        setApplicationScopes([...applicationScopes]);
                        setValue('application_scope', [...applicationScopes, item]);
                      } else {
                        setApplicationScopes(
                          applicationScopes?.filter((selectedItem) => selectedItem.id !== item.id)
                        );
                        setValue(
                          'application_scope',
                          applicationScopes?.filter((selectedItem) => selectedItem.id !== item.id)
                        );
                      }
                    }}
                  />
                )}
              />

              {item.name}
            </label>
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};

MultiSelect.propTypes = {
  control: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default MultiSelect;
