import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import ChevronIcon from 'components/pages/partners/apply/images/chevron.inline.svg';

const Select = ({ name, label, selected = null, setSelected = null, items, control }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <Combobox
        className="relative"
        as="div"
        value={selected || value}
        onChange={(e) => {
          onChange(e);
          if (typeof setSelected === 'function') {
            setSelected(e);
          }
        }}
      >
        <Combobox.Label>{label}</Combobox.Label>
        <div className="relative mt-3">
          <Combobox.Input
            className="h-10 w-full appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 caret-transparent transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15"
            displayValue={() => value?.name}
            disabled
          />
          <Combobox.Button
            className={clsx(
              'absolute right-0 top-1/2 flex h-full w-full -translate-y-1/2 items-center justify-end pr-4'
            )}
          >
            <ChevronIcon className="h-4 w-4" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute top-full mt-1.5 flex w-full flex-col gap-y-3 rounded border border-gray-new-15 bg-[#1c1d1e] p-4">
          {items.map((item) => (
            <Combobox.Option
              className="cursor-pointer text-sm leading-none transition-colors duration-200 hover:text-green-45 ui-active:text-green-45"
              key={item.id}
              as="fieldset"
              value={item}
            >
              {item.name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    )}
  />
);
Select.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  selected: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  ]),
  setSelected: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  control: PropTypes.any,
};

export default Select;
