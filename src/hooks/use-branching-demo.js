import { useState } from 'react';

const apiCall = async (endpoint, body = null) => {
  const response = await fetch(`/api/branching/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error);
  }
  return result;
};

export default function useBranchingDemo() {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [lastAddedRowId, setLastAddedRowId] = useState(null);
  const [databaseSize, setDatabaseSize] = useState(null);
  const [isSizeLoading, setIsSizeLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  const fetchDatabaseSize = async (branchId = currentBranch) => {
    try {
      setIsSizeLoading(true);
      const result = await apiCall('size', { branchId });
      setDatabaseSize(result.size);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[Database Size] Error:', error);
    } finally {
      setIsSizeLoading(false);
    }
  };

  const withLoading = async (fn) => {
    try {
      setIsLoading(true);
      setError(null);
      return await fn();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (branchId = 'main') =>
    withLoading(async () => {
      const result = await apiCall('data', { branchId });
      setTableData(result.data);
      setCurrentBranch(branchId);
    });

  const createBranch = async () =>
    withLoading(async () => {
      const result = await apiCall('branch/create');
      setExecutionTime(result.executionTime);
      return result;
    });

  const checkoutBranch = async (branchId) =>
    withLoading(async () => {
      const result = await apiCall('data', { branchId });
      setTableData(result.data);
      setCurrentBranch(branchId);
      return result;
    });

  const handleRowSelection = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const removeSelectedRows = async () =>
    withLoading(async () => {
      const result = await apiCall('rows/delete', {
        rowIds: selectedRows,
        branchId: currentBranch,
      });
      setExecutionTime(result.executionTime);
      await fetchData(currentBranch);
      setSelectedRows([]);
    });

  const addRandomRow = async () =>
    withLoading(async () => {
      const result = await apiCall('rows/add', { branchId: currentBranch });
      setExecutionTime(result.executionTime);
      await fetchData(currentBranch);
      setLastAddedRowId(result.newRow.id);
    });

  const restoreBranch = async () =>
    withLoading(async () => {
      const result = await apiCall('restore', { branchId: currentBranch });
      setExecutionTime(result.executionTime);
      await fetchData(currentBranch);
    });

  return {
    tableData,
    selectedRows,
    isLoading,
    error,
    currentBranch,
    lastAddedRowId,
    databaseSize,
    isSizeLoading,
    executionTime,
    fetchData,
    handleRowSelection,
    createBranch,
    checkoutBranch,
    removeSelectedRows,
    addRandomRow,
    restoreBranch,
    fetchDatabaseSize,
  };
}
