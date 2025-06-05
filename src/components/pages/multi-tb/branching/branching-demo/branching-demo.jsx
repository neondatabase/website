'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import useBranchingDemo from 'hooks/use-branching-demo';
import useToast from 'hooks/use-toast';
import branchingDemo from 'images/pages/multi-tb/branching-demo/branching-demo.jpg';

import BranchingDemoContent from './branching-demo-content';
import BranchingDemoTable from './branching-demo-table';
import BranchingDemoToast from './branching-demo-toast/branching-demo-toast';

const schema = yup
  .object({
    selectedRows: yup.array().of(yup.number()).min(1, 'Please select at least one row'),
  })
  .required();

const STEPS = {
  0: {
    action: async ({ fetchData, showToast, setCurrentStep }) => {
      setCurrentStep(1);
      showToast('Loading data from main database...', 'info');
      await fetchData();
      showToast('Data from main database loaded.', 'success');
    },
  },
  1: {
    action: async ({ createBranch, checkoutBranch, showToast }) => {
      showToast('Creating a copy of data in main database...', 'info');
      const result = await createBranch();

      if (!result?.branch?.id) {
        throw new Error('Failed to create branch');
      }

      showToast('Fetching data in the copied database...', 'info');
      const checkoutResult = await checkoutBranch(result.branch.id);

      if (!checkoutResult?.success) {
        throw new Error('Failed to fetch data from new branch');
      }

      showToast(`Successfully switched to branch: ${result.branch.id}`, 'success');
    },
  },
  2: {
    action: async ({ removeSelectedRows, showToast }) => {
      showToast('Dropping a row from the copied database...', 'info');
      await removeSelectedRows();
      showToast('Selected rows removed successfully.', 'success');
    },
  },
  3: {
    action: async ({ addRandomRow, showToast }) => {
      showToast('Adding a row to the copied database...', 'info');
      await addRandomRow();
      showToast('Random row added successfully.', 'success');
    },
  },
  4: {
    action: async ({ restoreBranch, fetchData, showToast }) => {
      showToast('Requesting database restore...', 'info');
      await restoreBranch();
      showToast('Fetching data of the restored database...', 'info');
      await fetchData();
    },
  },
};

const BranchingDemo = ({ steps, className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    tableData,
    selectedRows,
    isLoading,
    currentBranch,
    fetchData,
    handleRowSelection,
    createBranch,
    removeSelectedRows,
    addRandomRow,
    restoreBranch,
    checkoutBranch,
    lastAddedRowId,
  } = useBranchingDemo();
  const { showToast, open, message, type, hideToast } = useToast();

  const { handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedRows: [],
    },
  });

  const handleNextStep = async () => {
    try {
      if (currentStep === 5) {
        setCurrentStep(0);
        showToast('Demo reset successfully.', 'success');
        return;
      }

      const step = STEPS[currentStep];
      if (!step) {
        throw new Error(`Unknown step: ${currentStep}`);
      }

      await step.action({
        fetchData,
        createBranch,
        checkoutBranch,
        removeSelectedRows,
        addRandomRow,
        restoreBranch,
        showToast,
        setCurrentStep,
      });

      if (currentStep !== 0) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div
      className={clsx(
        'relative flex flex-1 flex-col overflow-hidden px-24 py-8 pt-[18px]',
        className
      )}
    >
      <form className="flex flex-1 flex-col gap-8" onSubmit={handleSubmit(handleNextStep)}>
        <ul className="relative flex items-center justify-center gap-1">
          {steps.map(({ id, iconClassName }, index) => (
            <React.Fragment key={id}>
              <li
                className={clsx(
                  'flex size-7 items-center justify-center rounded-full ring-1 transition-colors',
                  index <= currentStep ? 'text-green-45 ring-green-45' : 'ring-gray-new-15'
                )}
              >
                <span
                  className={clsx(
                    'size-[18px] transition-colors',
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
        <div className="flex flex-1 flex-row items-start gap-10">
          <BranchingDemoContent
            title={currentStepData.title}
            description={currentStepData.description}
            button={currentStepData.button}
            disabled={currentStep === 2 && selectedRows.length === 0}
            handleNextStep={handleNextStep}
            step={currentStep}
          />
          {currentStep === 0 ? (
            <Image
              className="pointer-events-none absolute bottom-0 right-0 z-10 rounded-[10px]"
              src={branchingDemo}
              alt=""
              width={525}
              height={418}
              placeholder="blur"
            />
          ) : (
            <BranchingDemoTable
              databaseBranchName={currentBranch}
              databaseTableName="playing_with_neon"
              tableData={tableData}
              selectedRows={selectedRows}
              handleRowSelection={handleRowSelection}
              isLoading={isLoading}
              isCheckboxInteractive={currentStep === 2}
              lastAddedRowId={lastAddedRowId}
            />
          )}
        </div>
      </form>
      <span className="pointer-events-none absolute -bottom-[193px] -left-[218px] size-[551px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(7,125,148,0.25)_0%,_rgba(7,125,148,0.00)_100%)] opacity-30" />

      <BranchingDemoToast open={open} message={message} type={type} onOpenChange={hideToast} />
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
