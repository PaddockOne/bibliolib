/**
 * Module containing configuration interfaces for filter functionality.
 */
export declare module FilterConfig {
    /**
     * Interface representing the configuration for an order item.
     */
    interface OrderItemConfig {
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
    interface OrderItemForRequest extends OrderItemConfig {
        /**
         * The direction of the order, either ascending ('asc') or descending ('desc').
         */
        direction: 'asc' | 'desc';
    }

    /**
     * Interface representing the configuration for a filter item.
     */
    interface FilterItemConfig extends OrderItemConfig {
        /**
         * The type of the filter item.
         * Can be one of 'list', 'date', 'nullOrNot', 'numeric_range', or 'check'.
         */
        type: 'list' | 'date' | 'nullOrNot' | 'numeric_range' | 'check';
    }

    /**
     * Interface representing the full configuration for a filter item.
     */
    interface FullFilterItemConfig extends FilterItemConfig {
        /**
         * The values associated with the filter item.
         */
        values: string[];
    }
}