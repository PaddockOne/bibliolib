export declare module FilterConfig {
    interface IOrderItemConfig {
        label: string;
        cat: string;
    }

    interface IOrderItemForRequest extends IOrderItemConfig {
        direction: 'asc' | 'desc';
    }

    interface IFilterItemConfig extends IOrderItemConfig {
        type: string;
    }

    interface IFullFilterItemConfig extends IFilterItemConfig {
        values: string[];
    }
}