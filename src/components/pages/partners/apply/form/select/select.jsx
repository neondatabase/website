import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import ChevronIcon from 'components/pages/partners/apply/images/chevron.inline.svg';
import closeSvg from 'components/pages/partners/apply/images/close.svg';
import Button from 'components/shared/button/button';

const Select = ({
  name,
  label,
  selected,
  setSelected,
  setQuery,
  items,
  multiple = false,
  multipleRef = null,
  control,
  ...otherProps
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <Combobox
        className="relative"
        as="div"
        multiple={multiple}
        value={value}
        onChange={(e) => {
          onChange(e);
          setSelected(e);
        }}
      >
        <Combobox.Label>{label}</Combobox.Label>
        <div
          className={clsx('relative mt-3', {
            'flex min-h-[40px] w-full appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 py-[7px] caret-transparent transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15':
              multiple,
          })}
        >
          {multiple && selected.length > 0 && (
            <ul className="flex flex-wrap gap-x-2 gap-y-1">
              {selected.map((item) => (
                <li
                  className="flex items-center gap-x-1 rounded-[20px] bg-green-45 py-[5px] pl-2.5 pr-[7px] font-medium leading-none text-black-new"
                  key={item.id}
                >
                  <span className="text-sm leading-none">{item.name}</span>
                  <Button
                    className="flex h-3.5 w-3.5 items-center"
                    aria-label="Remove"
                    onClick={() =>
                      setSelected(selected.filter((selectedItem) => selectedItem !== item))
                    }
                  >
                    <img src={closeSvg} alt="" width={8} height={14} loading="lazy" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Combobox.Input
            className={clsx(
              multiple
                ? 'pointer-events-none absolute inset-0 opacity-0 focus:outline-none'
                : 'h-10 w-full appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 caret-transparent transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15'
            )}
            displayValue={multiple ? undefined : () => value?.name}
            disabled
          />
          <Combobox.Button
            className={clsx(
              'absolute right-0 top-1/2 flex h-full -translate-y-1/2 items-center justify-end pr-4',
              multiple && !!selected?.length ? 'w-10' : 'w-full'
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
              disabled={multiple ? selected.includes(item) : false}
            >
              {multiple ? (
                <label className="flex cursor-pointer items-center gap-x-2">
                  <input
                    className="h-3.5 w-3.5 appearance-none rounded-sm border border-gray-new-40 bg-[length:10px_10px] bg-center bg-no-repeat transition-colors duration-200 checked:border-green-45 checked:bg-green-45 checked:bg-[url(/images/check.svg)] focus:outline-none"
                    type="checkbox"
                    name={name}
                    defaultChecked={selected.includes(item)}
                    id={item.id}
                    {...multipleRef}
                    {...otherProps}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected([...selected]);
                      } else {
                        setSelected(selected.filter((selectedItem) => selectedItem !== item));
                      }
                    }}
                  />
                  {item.name}
                </label>
              ) : (
                item.name
              )}
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
  ]).isRequired,
  setSelected: PropTypes.func.isRequired,
  setQuery: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  multiple: PropTypes.bool,
  multipleRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  control: PropTypes.any,
};

export default Select;
