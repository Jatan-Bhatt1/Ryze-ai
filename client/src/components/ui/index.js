/**
 * RYZE AI — Component Registry & Whitelist
 * This is the single source of truth for all allowed components.
 * The AI agent may ONLY use components exported from this file.
 */

import Button from './Button.jsx';
import Card from './Card.jsx';
import Input from './Input.jsx';
import Table from './Table.jsx';
import Modal from './Modal.jsx';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import Chart from './Chart.jsx';

// The whitelist — no other components may be used
export const ALLOWED_COMPONENTS = {
  Button,
  Card,
  Input,
  Table,
  Modal,
  Sidebar,
  Navbar,
  Chart,
};

// List of allowed component names for validation
export const COMPONENT_NAMES = Object.keys(ALLOWED_COMPONENTS);

// Get a component by name (returns undefined if not whitelisted)
export function getComponent(name) {
  return ALLOWED_COMPONENTS[name];
}

// Check if a component name is allowed
export function isAllowed(name) {
  return COMPONENT_NAMES.includes(name);
}

// Component prop schemas for the AI agent to reference
export const COMPONENT_SCHEMAS = {
  Button: {
    props: {
      variant: { type: 'string', enum: ['primary', 'secondary', 'danger', 'outline', 'ghost'], default: 'primary' },
      size: { type: 'string', enum: ['sm', 'md', 'lg'], default: 'md' },
      disabled: { type: 'boolean', default: false },
      onClick: { type: 'function' },
      children: { type: 'node', required: true },
      fullWidth: { type: 'boolean', default: false },
      icon: { type: 'node' },
    },
  },
  Card: {
    props: {
      title: { type: 'string' },
      subtitle: { type: 'string' },
      children: { type: 'node' },
      footer: { type: 'node' },
      variant: { type: 'string', enum: ['default', 'outlined', 'elevated'], default: 'default' },
      padding: { type: 'string', enum: ['sm', 'md', 'lg'], default: 'md' },
    },
  },
  Input: {
    props: {
      label: { type: 'string' },
      placeholder: { type: 'string' },
      type: { type: 'string', default: 'text' },
      value: { type: 'string' },
      onChange: { type: 'function' },
      error: { type: 'string' },
      helperText: { type: 'string' },
      disabled: { type: 'boolean', default: false },
      icon: { type: 'node' },
    },
  },
  Table: {
    props: {
      columns: { type: 'array', items: { key: 'string', header: 'string', width: 'string' }, required: true },
      data: { type: 'array', required: true },
      striped: { type: 'boolean', default: false },
      hoverable: { type: 'boolean', default: true },
      compact: { type: 'boolean', default: false },
    },
  },
  Modal: {
    props: {
      isOpen: { type: 'boolean', default: false },
      onClose: { type: 'function' },
      title: { type: 'string' },
      children: { type: 'node' },
      footer: { type: 'node' },
      size: { type: 'string', enum: ['sm', 'md', 'lg'], default: 'md' },
    },
  },
  Sidebar: {
    props: {
      items: { type: 'array', items: { label: 'string', icon: 'node', active: 'boolean', onClick: 'function' } },
      title: { type: 'string' },
      collapsed: { type: 'boolean', default: false },
    },
  },
  Navbar: {
    props: {
      brand: { type: 'node' },
      items: { type: 'array', items: { label: 'string', href: 'string', active: 'boolean', onClick: 'function' } },
      actions: { type: 'node' },
    },
  },
  Chart: {
    props: {
      type: { type: 'string', enum: ['bar', 'line', 'pie', 'doughnut'], default: 'bar' },
      data: { type: 'array', items: { label: 'string', value: 'number' }, required: true },
      title: { type: 'string' },
      height: { type: 'number', default: 200 },
    },
  },
};

export { Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart };
