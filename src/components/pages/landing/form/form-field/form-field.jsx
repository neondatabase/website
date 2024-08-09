import clsx from 'clsx';
import PropTypes from 'prop-types';

import Field from 'components/shared/field';
import { FORM_STATES } from 'constants/forms';

const labelClassName = 'mb-0 block w-fit text-sm text-gray-new-70';
const inputClassName =
  'remove-autocomplete-styles m-0 !h-10 !border-[1px] !bg-white/[0.04] !text-base text-white placeholder:tracking-tight placeholder:text-gray-new-40 focus:outline-none disabled:opacity-100 sm:placeholder:text-sm';
const errorClassName = 'w-full text-right text-xs leading-none';

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
  formState: PropTypes.string.isRequired,
  errors: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  index: PropTypes.number,
  isAzurePage: PropTypes.bool,
};

const Input = ({
  name,
  label,
  placeholder,
  required,
  formState,
  errors,
  register,
  index,
  isAzurePage = false,
}) => (
  <Field
    className="w-full"
    name={name}
    label={`${label}${required ? ' *' : ''}`}
    labelClassName={labelClassName}
    inputClassName={clsx(
      '!mt-0',
      inputClassName,
      errors[name]?.type === 'domain-not-blacklisted' && 'sm:mb-8'
    )}
    wrapperClassName={clsx(
      'mt-2',
      isAzurePage && index === 0 && 'bg-azure-form-input-1',
      isAzurePage && index === 1 && 'bg-azure-form-input-2',
      isAzurePage && index === 2 && 'bg-azure-form-input-3'
    )}
    type="text"
    tag="input"
    autoComplete={name}
    placeholder={placeholder}
    isDisabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
    error={errors[name]?.message}
    errorClassName={clsx(errorClassName, 'relative right-0 ml-auto mt-2 -mb-3')}
    {...register(name)}
  />
);

Input.propTypes = fieldPropTypes;

const SelectBox = ({ name, label, required, options, formState, errors, register }) => (
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

SelectBox.propTypes = fieldPropTypes;

const CheckBox = ({ name, label, required, formState, errors, register, options }) => (
  <div className="relative">
    <p className={clsx('leading-none', labelClassName)}>{`${label}${required ? ' *' : ''}`}</p>
    <div
      className={clsx(
        'mt-2.5 rounded border bg-white/[0.04] px-4 py-2 transition-colors duration-200',
        errors[name]?.message ? '!border-secondary-1' : 'border-transparent'
      )}
    >
      {options.map((option, index) => (
        <Field
          key={index}
          className="py-1.5"
          name={name}
          value={option.value}
          label={option.label}
          type="checkbox"
          theme="checkbox"
          tag="input"
          isDisabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
          {...register(name)}
        />
      ))}
    </div>
    {errors[name]?.message && (
      <p
        className={clsx(
          'absolute right-0 top-[calc(100%+0.5rem)] z-10 max-w-[350px] text-sm leading-none text-secondary-1 [&_a:hover]:no-underline [&_a]:underline [&_a]:underline-offset-2',
          errorClassName
        )}
        data-test="error-field-message"
        dangerouslySetInnerHTML={{ __html: errors[name]?.message }}
      />
    )}
  </div>
);

CheckBox.propTypes = fieldPropTypes;

const FormField = ({ fieldType, ...restProps }) => {
  if (fieldType === 'radio') return <SelectBox {...restProps} />;
  if (fieldType === 'checkbox') return <CheckBox {...restProps} />;
  return <Input {...restProps} />;
};

FormField.propTypes = fieldPropTypes;

export default FormField;
