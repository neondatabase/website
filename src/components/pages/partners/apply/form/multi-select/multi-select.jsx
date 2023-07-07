import { Combobox } from '@headlessui/react';
import PropTypes from 'prop-types';
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

const MultiSelect = ({ control, setValue, selectedValues }) => (
  <Combobox className="relative" as="div" value={selectedValues} multiple>
    <Combobox.Label className="text-sm leading-none text-gray-new-70">
      What application scope would you need?
    </Combobox.Label>
    <div className="relative mt-2 flex min-h-[40px] w-full appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 py-[7px] caret-transparent transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15">
      {selectedValues?.length > 0 && (
        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {selectedValues.map((item) => (
            <li
              className="relative z-10 flex items-center gap-x-1 rounded-[20px] bg-green-45 py-[5px] pl-2.5 pr-[7px] font-medium leading-none text-black-new"
              key={item.id}
            >
              <span className="text-sm leading-none">{item.name}</span>
              <Button
                className="flex h-3.5 w-3.5 items-center"
                aria-label="Remove"
                type="button"
                onClick={() =>
                  setValue(
                    'application_scope',
                    selectedValues.filter((i) => i.id !== item.id)
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
        className="pointer-events-none absolute inset-0 opacity-0 focus:outline-none"
        readOnly
      />
      <Combobox.Button className="absolute right-0 top-1/2 flex h-full w-full -translate-y-1/2 items-center justify-end pr-4">
        <ChevronIcon className="h-4 w-4" />
      </Combobox.Button>
    </div>
    <Combobox.Options className="absolute top-full z-10 mt-1.5 flex w-full flex-col gap-y-3 rounded border border-gray-new-15 bg-[#1c1d1e] p-4">
      {applicationScopeOptions.map((item) => (
        <Combobox.Option
          className="ui-selected:multi-checkbox cursor-pointer text-sm leading-none transition-colors duration-200 hover:text-green-45 ui-active:text-green-45"
          key={item.id}
          value={item}
        >
          <label className="flex cursor-pointer items-center gap-x-2" htmlFor={`option-${item.id}`}>
            <Controller
              control={control}
              name="application_scope"
              render={() => (
                <input
                  className="h-3.5 w-3.5 appearance-none rounded-sm border border-gray-new-40 bg-[length:10px_10px] bg-center bg-no-repeat transition-colors duration-200 checked:border-green-45 checked:bg-green-45 checked:bg-[url(/images/check.svg)] focus:outline-none"
                  type="checkbox"
                  defaultChecked={selectedValues?.some((i) => i.id === item?.id)}
                  id={`option-${item.id}`}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue('application_scope', [...selectedValues, item]);
                    } else {
                      setValue(
                        'application_scope',
                        selectedValues?.filter((selectedItem) => selectedItem.id !== item.id)
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

MultiSelect.propTypes = {
  control: PropTypes.any.isRequired,
  setValue: PropTypes.func.isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default MultiSelect;
