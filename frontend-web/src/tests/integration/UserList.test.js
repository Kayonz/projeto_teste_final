import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserList from '@/components/UserList';
import fetchUsers from '@/services/api';

jest.mock('@/services/api');

describe('UserList', () => {
  it('should display a list of users', async () => {
    fetchUsers.mockResolvedValueOnce([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);

    render(<UserList />);

    expect(screen.getByText('User List')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('should display no users found message if no users are returned', async () => {
    fetchUsers.mockResolvedValueOnce([]);

    render(<UserList />);

    expect(screen.getByText('User List')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No users found.')).toBeInTheDocument();
    });
  });
});


