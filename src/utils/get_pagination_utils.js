'use strict';

/**
 * Generates pagination object based on given request paramaters, limit, and total number of blogs.
 * 
 * @param {object} reqParams - The request parameters object containing currentPage.
 * @param {number} limit - The limit of blogs per page.
 * @param {number} totalBlogs - The total number of blogs.
 * @returns {object} Pagination object with next, prev, total, and current page information.
 */

const getPagination = (currentRoute, reqParams, limit, totalBlogs) => {
    const currentPage = Number(reqParams.pageNumber) || 1;
    const skip = limit * (currentPage - 1);
    const totalPage = Math.ceil(totalBlogs / limit); 

    const next = totalBlogs > (currentPage * limit) ? `${currentRoute === '/' ? currentRoute :  currentRoute + '/'}page/${currentPage + 1}` : '';
    const prev = skip && currentPage <= totalPage ? `${currentRoute === '/' ? currentRoute :  currentRoute + '/'}page/${currentPage - 1}` : '';

    const paginationObj = {
        next,
        prev,
        totalPage,
        currentPage,
        skip,
        limit,
    };

    return paginationObj;
}

module.exports = getPagination;