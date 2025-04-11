import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface TableData {
  tableNumber: string;
  capacity: number;
  location: 'indoor' | 'outdoor' | 'bar';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  features?: string[];
  currentOrder?: string;
}

const TableManagement: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTables();
  }, [restaurantId]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/admin/hotel/restaurant/${restaurantId}/tables`);
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async (values: any) => {
    try {
      const response = await axios.post(`/api/v1/admin/hotel/restaurant/${restaurantId}/tables`, values);
      if (response.data.success) {
        message.success('Table added successfully');
        setIsAddModalVisible(false);
        form.resetFields();
        fetchTables();
      }
    } catch (error) {
      message.error('Failed to add table');
    }
  };

  const handleDeleteTable = async (tableNumber: string) => {
    try {
      const response = await axios.delete(`/api/v1/admin/hotel/restaurant/${restaurantId}/tables/${tableNumber}`);
      if (response.data.success) {
        message.success('Table deleted successfully');
        fetchTables();
      }
    } catch (error) {
      message.error('Failed to delete table');
    }
  };

  const handleUpdateStatus = async (tableNumber: string, status: string) => {
    try {
      const response = await axios.patch(
        `/api/v1/admin/hotel/restaurant/${restaurantId}/tables/${tableNumber}/status`,
        { status }
      );
      if (response.data.success) {
        message.success('Table status updated successfully');
        fetchTables();
      }
    } catch (error) {
      message.error('Failed to update table status');
    }
  };

  const columns = [
    {
      title: 'Table Number',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: TableData) => (
        <Select
          value={status}
          onChange={(value) => handleUpdateStatus(record.tableNumber, value)}
          style={{ width: 120 }}
        >
          <Option value="available">Available</Option>
          <Option value="occupied">Occupied</Option>
          <Option value="reserved">Reserved</Option>
          <Option value="maintenance">Maintenance</Option>
        </Select>
      ),
    },
    {
      title: 'Features',
      dataIndex: 'features',
      key: 'features',
      render: (features: string[]) => features?.join(', ') || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TableData) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this table?"
            onConfirm={() => handleDeleteTable(record.tableNumber)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
        >
          Add Table
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tables}
        loading={loading}
        rowKey="tableNumber"
      />

      <Modal
        title="Add New Table"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTable}
        >
          <Form.Item
            name="tableNumber"
            label="Table Number"
            rules={[{ required: true, message: 'Please input table number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: 'Please input capacity!' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please select location!' }]}
          >
            <Select>
              <Option value="indoor">Indoor</Option>
              <Option value="outdoor">Outdoor</Option>
              <Option value="bar">Bar</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="features"
            label="Features"
          >
            <Select mode="tags" placeholder="Add features">
              <Option value="window">Window</Option>
              <Option value="power-outlet">Power Outlet</Option>
              <Option value="tv">TV</Option>
              <Option value="heater">Heater</Option>
              <Option value="umbrella">Umbrella</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Table
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableManagement; 