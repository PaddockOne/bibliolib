/**
 * Module containing configuration interfaces for filter functionality.
 */
export declare module FilterConfig {
    /**
     * Interface representing the configuration for an order item.
     */
    interface IOrderItemConfig {
        /**
         * The label of the order item.
         */
        label: string;

        /**
         * The category of the order item.
         */
        cat: string;
    }

    /**
     * Interface representing the configuration for an order item request.
     */
    interface IOrderItemForRequest extends IOrderItemConfig {
        /**
         * The direction of the order, either ascending ('asc') or descending ('desc').
         */
        direction: 'asc' | 'desc';
    }

    /**
     * Interface representing the configuration for a filter item.
     */
    interface IFilterItemConfig extends IOrderItemConfig {
        /**
         * The type of the filter item.
         * Can be one of 'list', 'date', 'nullOrNot', 'numeric_range', or 'check'.
         */
        type: string;
    }

    /**
     * Interface representing the full configuration for a filter item.
     */
    interface IFullFilterItemConfig extends IFilterItemConfig {
        /**
         * The values associated with the filter item.
         */
        values: string[];
    }
}