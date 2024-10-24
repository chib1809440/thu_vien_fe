import React, { FunctionComponent, ReactElement } from 'react';
import { BarcodeStateProps } from './barcode';
import { LoanSlipStateProps } from './loanSlip';

// material-ui
import { ChipProps, SvgIconTypeMap, TableCellProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { OverridableComponent } from '@mui/material/OverridableComponent';

// project imports
import { TablerIcon } from '@tabler/icons';
import { CalendarStateProps } from './calendar';
import { CartStateProps } from './cart';
import { ChatStateProps } from './chat';
import { ContactStateProps } from './contact';
import { CustomerStateProps } from './customer';
import { ProductStateProps } from './e-commerce';
import { KanbanStateProps } from './kanban';
import { MailStateProps } from './mail';
import { UserStateProps } from './user';

import { AssetsLibStateProps } from './AssetsLib';
import { AllAccountStateProps } from './allAccount';
import { ApiStateProps } from './apiLT';
import { AuthorStateProps } from './author';
import { CabinetStateProps } from './cabinet';
import { CategoryStateProps } from './category';
import { ContactSchoolProps } from './contactSchool';
import { GroupPowerStateProps } from './groupPower';
import { IsAuthLTStateProps } from './isAuthLT';
import { PrintedMatterStateProps } from './printedMaster';
import { ProducerStateProps } from './producer';
import { ProjectWaitingStateProps } from './projectwaiting';
import { RegisterSlipStateProps } from './registerSlip';
import { SnackbarProps } from './snackbar';
import { StateOfBookStateProps } from './stateOfBook';
import { SuppliesStateProps } from './supplies';
import { StopStandingStateProps } from './topStanding';
import { TypeSuplyStateProps } from './typeSuplly';
import { UsbStateProps } from './usb';
import { UserLTStateProps } from './userLT';
import { SuppliesLTStateProps } from './suppliesLT';

// declare module '@mui/styles/defaultTheme' {
//     // eslint-disable-next-line @typescript-eslint/no-empty-interface
//     interface DefaultTheme extends Theme {}
// }

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type DateRange = { start: number | Date; end: number | Date };

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export type Direction = 'up' | 'down' | 'right' | 'left';

export interface TabsProps {
    children?: React.ReactElement | React.ReactNode | string;
    value: string | number;
    index: number;
}

export interface GenericCardProps {
    title?: string;
    primary?: string | number | undefined;
    secondary?: string;
    content?: string;
    image?: string;
    dateTime?: string;
    iconPrimary?: OverrideIcon;
    color?: string;
    size?: string;
}

export type OverrideIcon =
    | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    })
    | React.ComponentClass<any>
    | FunctionComponent<any>
    | TablerIcon;

export interface EnhancedTableHeadProps extends TableCellProps {
    onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
    order?: ArrangementOrder;
    orderBy?: string;
    numSelected: number;
    rowCount: number;
    onRequestSort: (e: React.SyntheticEvent, p: string) => void;
}

export interface EnhancedTableToolbarProps {
    numSelected: number;
}

export type HeadCell = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type NavItemTypeObject = { children?: NavItemType[]; items?: NavItemType[]; type?: string };

export type NavItemType = {
    id?: string;
    icon?: GenericCardProps['iconPrimary'];
    target?: boolean;
    external?: string;
    url?: string | undefined;
    type?: string;
    title?: React.ReactNode | string;
    color?: 'primary' | 'secondary' | 'default' | undefined;
    caption?: React.ReactNode | string;
    breadcrumbs?: boolean;
    disabled?: boolean;
    chip?: ChipProps;
};

export type AuthSliderProps = {
    title: string;
    description: string;
};

export interface ColorPaletteProps {
    color: string;
    label: string;
    value: string;
}

export interface DefaultRootStateProps {
    snackbar: SnackbarProps;
    cart: CartStateProps;
    kanban: KanbanStateProps;
    customer: CustomerStateProps;
    contact: ContactStateProps;
    product: ProductStateProps;
    chat: ChatStateProps;
    calendar: CalendarStateProps;
    mail: MailStateProps;
    user: UserStateProps;
    getlistprojectwaiting: ProjectWaitingStateProps;
}
export interface LibRootStateProps {
    allAccount: AllAccountStateProps;
    getGroupPower: GroupPowerStateProps;
    getLoanSlip: LoanSlipStateProps;
    getSupplies: SuppliesStateProps;
    getSuppliesLT: SuppliesLTStateProps;
    getCategory: CategoryStateProps;
    getAuthor: AuthorStateProps;
    getProducer: ProducerStateProps;
    getCabinet: CabinetStateProps;
    getPrintedMatter: PrintedMatterStateProps;
    getTopStanding: StopStandingStateProps;
    getContactSchool: ContactSchoolProps;
    getTypeSuply: TypeSuplyStateProps;
    getStateOfBook: StateOfBookStateProps;
    getRegisterSlip: RegisterSlipStateProps
    getAssetsLib: AssetsLibStateProps;
    getUsb: UsbStateProps;
    getBarcode: BarcodeStateProps;
    getApiLT: ApiStateProps;
    isLogin: IsAuthLTStateProps;
    getUserLT: UserLTStateProps;
}

export interface ColorProps {
    readonly [key: string]: string;
}

export type GuardProps = {
    children: ReactElement | null;
};

export interface StringColorProps {
    id?: string;
    label?: string;
    color?: string;
    primary?: string;
    secondary?: string;
}

export interface FormInputProps {
    bug: KeyedObject;
    fullWidth?: boolean;
    size?: 'small' | 'medium' | undefined;
    label: string;
    name: string;
    required?: boolean;
    InputProps?: {
        label: string;
        startAdornment?: React.ReactNode;
    };
}

/** ---- Common Functions types ---- */

export type StringBoolFunc = (s: string) => boolean;
export type StringNumFunc = (s: string) => number;
export type NumbColorFunc = (n: number) => StringColorProps | undefined;
export type ChangeEventFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;

// amit

export type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};
