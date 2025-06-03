'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import branchingDemo from 'images/pages/multi-tb/branching-demo/branching-demo.jpg';

import BranchingDemoContent from './branchim-demo-content';
import BranchingDemoTable from './branchim-demo-table';

const TABLE_DATA = [
  { id: 1, singer: 'zwan', song: 'song 1' },
  { id: 2, singer: 'wane soe wane soe 321', song: 'song 2' },
  { id: 3, singer: 'ziggy-marley', song: 'good-old-days' },
  { id: 4, singer: 'rane foe', song: 'ziggy-marley' },
  { id: 5, singer: 'tohn goe 321 fdksl', song: 'song 5g fdjgk fdjkg jfd ' },
];

const schema = yup
  .object({
    selectedRows: yup.array().of(yup.number()).min(1, 'Please select at least one row'),
  })
  .required();

const BranchingDemo = ({ steps, className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tableData, setTableData] = useState(TABLE_DATA);
  const [selectedRows, setSelectedRows] = useState([]);

  const { handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedRows: [],
    },
  });

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Reset the demo
      setCurrentStep(0);
      setTableData(TABLE_DATA);
      setSelectedRows([]);
    }
  };

  const handleRowSelection = (rowId, element) => {
    element?.blur();
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      }
      return [...prev, rowId];
    });
  };

  const handleRemoveRows = () => {
    setTableData((prev) => prev.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    handleNextStep();
  };

  const handleAddRandomRow = () => {
    const newRow = {
      id: tableData.length + 1,
      singer: 'Random Singer',
      song: `Random Song ${tableData.length + 1}`,
    };
    setTableData((prev) => [...prev, newRow]);
    handleNextStep();
  };

  const handleRestore = () => {
    setTableData(TABLE_DATA);
    handleNextStep();
  };

  const renderFormStep = () => {
    const currentStepData = steps[currentStep];

    switch (currentStep) {
      case 0:
        return (
          <>
            <BranchingDemoContent
              title={currentStepData.title}
              description={currentStepData.description}
              button={currentStepData.button}
              handleNextStep={handleNextStep}
              step={currentStep}
            />
            <Image
              className="pointer-events-none absolute bottom-0 right-0 z-10 rounded-[10px]"
              src={branchingDemo}
              alt=""
              width={525}
              height={418}
              placeholder="blur"
            />
          </>
        );
      case 1:
        return (
          <>
            <BranchingDemoContent
              title={currentStepData.title}
              description={currentStepData.description}
              button={currentStepData.button}
              handleNextStep={handleNextStep}
              step={currentStep}
            />
            <BranchingDemoTable
              tableBranchHead="main"
              tableBranchTarget="playing_with_neon"
              tableData={tableData}
              selectedRows={selectedRows}
              handleRowSelection={handleRowSelection}
            />
          </>
        );
      case 2:
      case 3:
        return (
          <>
            <BranchingDemoContent
              title={currentStepData.title}
              description={currentStepData.description}
              button={currentStepData.button}
              disabled={currentStep === 2 && selectedRows.length === 0}
              handleNextStep={currentStep === 2 ? handleRemoveRows : handleAddRandomRow}
              step={currentStep}
            />
            <BranchingDemoTable
              tableBranchHead="br-nameless-frost-a5gxkd0i"
              tableBranchTarget="playing_with_neon"
              tableData={tableData}
              selectedRows={selectedRows}
              handleRowSelection={handleRowSelection}
            />
          </>
        );
      case 4:
        return (
          <BranchingDemoContent
            title={currentStepData.title}
            description={currentStepData.description}
            button={currentStepData.button}
            handleNextStep={handleRestore}
            step={currentStep}
          />
        );
      case 5:
        return (
          <BranchingDemoContent
            title={currentStepData.title}
            description={currentStepData.description}
            button={currentStepData.button}
            handleNextStep={handleNextStep}
            step={currentStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={clsx('relative flex flex-1 flex-col px-24 py-8 pt-[18px]', className)}>
      <form className="flex flex-1 flex-col gap-8" onSubmit={handleSubmit(handleNextStep)}>
        <ul className="relative flex items-center justify-center gap-1">
          {steps.map(({ id, iconClassName }, index) => (
            <React.Fragment key={id}>
              <li
                className={clsx(
                  'flex size-7 items-center justify-center rounded-full ring-1',
                  index <= currentStep ? 'text-green-45 ring-green-45' : 'ring-gray-new-15'
                )}
              >
                <span
                  className={clsx(
                    'size-[18px]',
                    iconClassName,
                    index <= currentStep ? 'bg-white' : 'bg-gray-new-30'
                  )}
                />
              </li>
              {index < steps.length - 1 && (
                <li className="h-px w-[60px] bg-gray-new-15" aria-hidden />
              )}
            </React.Fragment>
          ))}
        </ul>
        <div className="flex flex-1 flex-row items-start gap-10">{renderFormStep()}</div>
      </form>
      <span className="pointer-events-none absolute -bottom-[193px] -left-[218px] size-[551px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(7,125,148,0.25)_0%,_rgba(7,125,148,0.00)_100%)] opacity-30" />
    </div>
  );
};

BranchingDemo.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      button: PropTypes.shape({
        text: PropTypes.string.isRequired,
        theme: PropTypes.string.isRequired,
      }).isRequired,
      iconClassName: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default BranchingDemo;
