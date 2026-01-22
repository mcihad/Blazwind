/**
 * Blazwind - Modern Blazor Component Library
 * Main entry point
 */

import './style.css';
import * as Toast from './components/toast';
import * as Dialog from './components/dialog';
import * as Nav from './components/nav';
import * as Sidebar from './components/sidebar';
import * as List from './components/list';
import * as Drawer from './components/drawer';
import { ContextMenu } from './components/contextMenu';
import * as CommandPalette from './components/commandPalette';
import * as Confetti from './components/confetti';
import * as Calendar from './components/calendar';
import * as SplitPanel from './components/splitPanel';
import * as VirtualScroll from './components/virtualScroll';
import * as InfiniteScroll from './components/infiniteScroll';
import * as ColumnDrag from './components/columnDrag';
import * as ColumnResize from './components/columnResize';
import * as QRCode from './components/qrcode';
import * as RangeBrush from './components/range-brush';
import * as RangeSlider from './components/range-slider';
import * as SignaturePad from './components/signaturePad';
import * as Barcode from './components/barcode';
import * as OrgChart from './components/orgChart';
import * as Printable from './components/printable';
import * as Workflow from './workflow';
import * as Gantt from './components/gantt';
import * as DocumentViewer from './components/documentViewer';
import * as Tour from './components/tour';
import * as Tabs from './components/tabs';
import * as Dropdown from './components/dropdown';
import * as Toolbar from './components/toolbar';


// Expose modules globally for JSInterop
declare global {
    interface Window {
        Blazwind: {
            Toast: typeof Toast;
            Dialog: typeof Dialog;
            Nav: typeof Nav;
            Sidebar: typeof Sidebar;
            List: typeof List;
            Drawer: typeof Drawer;
            ContextMenu: typeof ContextMenu;
            commandPalette: typeof CommandPalette;
            confetti: typeof Confetti;
            Calendar: typeof Calendar;
            SplitPanel: typeof SplitPanel;
            VirtualScroll: typeof VirtualScroll;
            InfiniteScroll: typeof InfiniteScroll;
            ColumnDrag: typeof ColumnDrag;
            ColumnResize: typeof ColumnResize;
            QRCode: typeof QRCode;
            RangeBrush: typeof RangeBrush;
            RangeSlider: typeof RangeSlider;
            SignaturePad: typeof SignaturePad;
            Barcode: typeof Barcode;
            OrgChart: typeof OrgChart;
            Printable: typeof Printable;
            Workflow: typeof Workflow;
            Gantt: typeof Gantt;
            DocumentViewer: typeof DocumentViewer;
            Tour: typeof Tour;
            Tabs: typeof Tabs;
            Dropdown: typeof Dropdown;
            Toolbar: typeof Toolbar;
        };
    }
}

window.Blazwind = {
    Toast,
    Dialog,
    Nav,
    Sidebar,
    List,
    Drawer,
    ContextMenu,
    commandPalette: CommandPalette,
    confetti: Confetti,
    Calendar,
    SplitPanel,
    VirtualScroll,
    InfiniteScroll,
    ColumnDrag,
    ColumnResize,
    QRCode,
    RangeBrush,
    RangeSlider,
    SignaturePad,
    Barcode,
    OrgChart,
    Printable,
    Workflow,
    Gantt,
    DocumentViewer,
    Tour,
    Tabs,
    Dropdown,
    Toolbar
};

export { Toast, Dialog, Nav, Sidebar, List, Drawer, ContextMenu, CommandPalette as commandPalette, Confetti as confetti, Calendar, SplitPanel, VirtualScroll, InfiniteScroll, ColumnDrag, ColumnResize, QRCode, RangeBrush, RangeSlider, SignaturePad, Barcode, OrgChart, Printable, Workflow, Gantt, DocumentViewer, Tour, Tabs, Dropdown, Toolbar };

