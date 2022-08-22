import * as React from 'react';
import { Fragment, useCallback } from 'react';
import { List, useGetList, useListContext } from 'react-admin';
import {
    useMediaQuery,
    Divider,
    Tabs,
    Tab,
    Theme,
    Drawer,
} from '@mui/material';

import reviewFilters from './reviewFilters';
import MobileGrid from '../orders/MobileGrid';
import ReviewListDesktop from './ReviewListDesktop';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import ReviewEdit from './ReviewEdit';

const StarTabbedList = () => (
    <List
        filterDefaultValues={{ rating: 1 }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={reviewFilters}
    >
        <TabbedList />
    </List>
);

const tabs = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
];

const useGetTotals = (filterValues: any) => {
    const { total: totalOne } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, rating: 1 },
    });
    const { total: totalTwo } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, rating: 2 },
    });
    const { total: totalThree } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, rating: 3 },
    });
    const { total: totalFour } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, rating: 4 },
    });
    const { total: totalFive } = useGetList('reviews', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'date', order: 'DESC' },
        filter: { ...filterValues, rating: 5 },
    });

    return {
        1: totalOne,
        2: totalTwo,
        3: totalThree,
        4: totalFour,
        5: totalFive,
    };
};

const TabbedList = () => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const totals = useGetTotals(filterValues) as any;

    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = useCallback(
        (event: React.ChangeEvent<{}>, value: any) => {
            setFilters &&
                setFilters(
                    { ...filterValues, rating: value },
                    displayedFilters,
                    false // no debounce, we want the filter to fire immediately
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    const handleClose = useCallback(() => {
        navigate('/reviews');
    }, [navigate]);

    const match = matchPath('/reviews/:id', location.pathname);
    console.log('listContext =>', listContext);
    return (
        <Fragment>
            <Tabs
                variant="fullWidth"
                centered
                value={filterValues.status}
                indicatorColor="primary"
                onChange={handleChange}
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            totals[choice.name]
                                ? `${choice.name} Star(${totals[choice.name]})`
                                : choice.name
                        }
                        value={choice.id}
                    />
                ))}
            </Tabs>
            <Divider />
            {isXSmall ? (
                <MobileGrid />
            ) : (
                <>
                    {filterValues.rating === 1 && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                    {filterValues.rating === 2 && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                    {filterValues.rating === 3 && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                    {filterValues.rating === 4 && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                    {filterValues.rating === 5 && (
                        <ReviewListDesktop
                            selectedRow={
                                !!match
                                    ? parseInt((match as any).params.id, 10)
                                    : undefined
                            }
                        />
                    )}
                    <Drawer
                        variant="persistent"
                        open={!!match}
                        anchor="right"
                        onClose={handleClose}
                        sx={{ zIndex: 100 }}
                    >
                        {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                        {!!match && (
                            <ReviewEdit
                                id={(match as any).params.id}
                                onCancel={handleClose}
                            />
                        )}
                    </Drawer>
                </>
            )}
        </Fragment>
    );
};

export default StarTabbedList;
