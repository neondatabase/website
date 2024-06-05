import clsx from 'clsx';
import PropTypes from 'prop-types';

import Field from 'components/shared/field';
import { FORM_STATES } from 'constants/forms';

const labelClassName = 'mb-0 block w-fit text-sm text-gray-new-70';
const inputClassName =
  'remove-autocomplete-styles m-0 !h-10 !border-[1px] !bg-white/[0.04] !text-base text-white placeholder:tracking-tight placeholder:text-gray-new-40 focus:outline-none disabled:opacity-100 sm:placeholder:text-sm';
const errorClassName = 'w-full text-right text-xs leading-none';

const FormField = ({
  name,
  label,
  placeholder,
  fieldType,
  required,
  options,
  formState,
  errors,
  register,
}) => {
  if (fieldType === 'radio')
    return (
      <Field
        className="w-full"
        name={name}
        label={`${label}${required ? ' *' : ''}`}
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        tag="select"
        defaultValue="hidden"
        isDisabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
        error={errors[name]?.message}
        errorClassName={errorClassName}
        {...register(name)}
      >
        <option value="hidden" disabled hidden />
        {options?.map((option, index) => (
          <option value={option.value} key={index}>
            {option.label}
          </option>
        ))}
      </Field>
    );

  if (fieldType === 'checkbox')
    return (
      <>
        <p className={clsx('leading-none', labelClassName)}>{label}</p>
        <div className="mt-2.5">
          {options.map((option, index) => (
            <Field
              key={index}
              className="py-1.5"
              name={option.value}
              label={option.label}
              type="checkbox"
              theme="checkbox"
              tag="input"
              isDisabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
              {...register(option.value)}
            />
          ))}
        </div>
      </>
    );

  return (
    <Field
      className="w-full"
      name={name}
      label={`${label}${required ? ' *' : ''}`}
      labelClassName={labelClassName}
      inputClassName={inputClassName}
      type="text"
      tag="input"
      autoComplete={name}
      placeholder={placeholder}
      isDisabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
      error={errors[name]?.message}
      errorClassName={errorClassName}
      {...register(name)}
    />
  );
};

const fieldPropTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

FormField.propTypes = {
  ...fieldPropTypes,
  formState: PropTypes.string.isRequired,
  errors: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
};

export default FormField;
