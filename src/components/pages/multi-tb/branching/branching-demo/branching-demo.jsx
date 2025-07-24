'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import LINKS from 'constants/links';
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

const BranchingDemo = ({ className }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    tableData,
    selectedRows,
    isLoading,
    currentBranch,
    databaseSize,
    isSizeLoading,
    executionTime,
    fetchData,
    handleRowSelection,
    createBranch,
    removeSelectedRows,
    addRandomRow,
    restoreBranch,
    checkoutBranch,
    lastAddedRowId,
    fetchDatabaseSize,
  } = useBranchingDemo();
  const { showToast, open, message, type, hideToast } = useToast();

  const { handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedRows: [],
    },
  });

  useEffect(() => {
    setValue('selectedRows', selectedRows);
  }, [selectedRows, setValue]);

  const STEPS = {
    0: {
      title: 'Copy your database in milliseconds - regardless of size',
      description:
        "In this demo, you will create a copy of your database, make changes to it, and restore it to the original state in milliseconds. Behind the scenes, you are leveraging Neon's instant branching.",
      button: {
        text: "Let's begin",
        theme: 'primary',
      },
      iconClassName: 'branching-demo-speedometer-icon',
      action: async ({ fetchData, showToast, setCurrentStep }) => {
        setCurrentStep(1);
        showToast('Loading data from main database...', 'info');
        fetchData();
        fetchDatabaseSize('main');
        showToast('Data from main database loaded.', 'success');
      },
    },
    1: {
      title: 'Create your own Postgres database',
      description: `A Neon database is created in under a second. For now, we have prepared a database for you to copy. Currently, the size of this database is about <span class="text-white">${isSizeLoading ? '......' : databaseSize}</span>.`,
      button: {
        text: 'Create a copy',
        theme: 'primary',
      },
      iconClassName: 'branching-demo-database-icon',
      action: async ({ createBranch, checkoutBranch, showToast, fetchDatabaseSize }) => {
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
        fetchDatabaseSize(result.branch.id);
        showToast(`Successfully switched to branch: ${result.branch.id}`, 'success');
      },
    },
    2: {
      title: 'I want to make changes in the copy',
      description: `In about <span class="text-white">${executionTime ? `${executionTime} ms` : '......'}</span>, your copy of <span class="text-white">${isSizeLoading ? '......' : databaseSize}</span> was created. Now, let's make a change to make sure that it is an isolated copy of your original database.`,
      button: {
        text: 'Remove selected rows',
        theme: 'red-filled',
      },
      iconClassName: 'branching-demo-clone-icon',
      action: async ({ removeSelectedRows, showToast, fetchDatabaseSize }) => {
        showToast('Dropping a row from the copied database...', 'info');
        await removeSelectedRows();
        fetchDatabaseSize();
        showToast('Selected rows removed successfully.', 'success');
      },
    },
    3: {
      title: 'I want to make more changes in the copy',
      description: `In about <span class="text-white">${executionTime ? `${executionTime} ms` : '......'}</span>, you dropped a row in your copied database. Now, let's make one more change to make sure that your data is quite different from the original database.`,
      button: {
        text: 'Add a random row',
        theme: 'primary',
      },
      iconClassName: 'branching-demo-circle-minus-icon',
      action: async ({ addRandomRow, showToast, fetchDatabaseSize }) => {
        showToast('Adding a row to the copied database...', 'info');
        await addRandomRow();
        fetchDatabaseSize();
        showToast('Random row added successfully.', 'success');
      },
    },
    4: {
      title: 'But... I messed it up!',
      description: `In about <span class="text-white">${executionTime ? `${executionTime} ms` : '......'}</span>, you inserted a row in your copied database. But what if you wanted to restore the initial state?`,
      button: {
        text: 'Restore the database',
        theme: 'primary',
      },
      iconClassName: 'branching-demo-circle-plus-icon',
      action: async ({ restoreBranch, fetchData, showToast, fetchDatabaseSize }) => {
        showToast('Requesting database restore...', 'info');
        await restoreBranch();
        showToast('Fetching data of the restored database...', 'info');
        await fetchData();
        fetchDatabaseSize();
      },
    },
    5: {
      title: "Yay, it's back!",
      description: `In about <span class="text-white">${executionTime ? `${executionTime} ms` : '......'}</span>, you restored your copied database of <span class="text-white">${isSizeLoading ? '......' : databaseSize}</span> to its original state. Try this on your own data, sign up for Neon.`,
      button: {
        text: 'Sign up',
        to: LINKS.signup,
        theme: 'primary',
      },
      iconClassName: 'branching-demo-restore-icon',
    },
  };

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
        fetchDatabaseSize,
      });

      if (currentStep !== 0) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const currentStepData = STEPS[currentStep];

  return (
    <div
      className={clsx(
        'relative flex flex-1 flex-col overflow-hidden px-24 py-8 pt-[18px] lg:px-12 lg:py-[76px] lg:pt-7',
        className
      )}
    >
      <form className="flex flex-1 flex-col gap-8" onSubmit={handleSubmit(handleNextStep)}>
        <ul className="relative z-20 flex items-center justify-center gap-1">
          {Object.values(STEPS).map(({ iconClassName }, index) => (
            <React.Fragment key={index}>
              <li
                className={clsx(
                  'relative flex size-7 items-center justify-center rounded-full transition-colors lg:size-6',
                  'after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:transition-colors',
                  index <= currentStep
                    ? 'bg-[radial-gradient(112.79%_117.86%_at_50%_100%,#087D69_0%,#0B2D29_47.12%)] text-green-45 after:border-white after:mix-blend-overlay'
                    : 'after:border-gray-new-15'
                )}
              >
                <span
                  className={clsx(
                    'size-[18px] transition-colors lg:size-[14px]',
                    iconClassName,
                    index <= currentStep ? 'bg-white' : 'bg-gray-new-30'
                  )}
                />
              </li>
              {index < Object.keys(STEPS).length - 1 && (
                <li
                  className={clsx('h-px w-[60px] transition-colors duration-300 lg:w-[40px]', {
                    'bg-[#0B4C43]': index < currentStep,
                    'bg-gradient-to-r from-[#0B4C43] to-gray-new-15': index === currentStep,
                    'bg-gray-new-15': index > currentStep,
                  })}
                  aria-hidden
                />
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
            isLoading={isLoading}
            handleNextStep={handleNextStep}
            step={currentStep}
          />
          {currentStep === 0 ? (
            <Image
              className="pointer-events-none absolute bottom-0 right-0 z-10 rounded-[10px] lg:bottom-[33px] lg:right-[-32px] lg:w-[410px]"
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
  className: PropTypes.string,
};

export default BranchingDemo;
