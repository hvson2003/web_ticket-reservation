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

    const paginationObj = {
        next: totalBlogs > (currentPage * limit) ? `${currentRoute}page/${currentPage + 1}` : null,
        prev: skip && currentPage <= totalPage ? `${currentRoute}page/${currentPage - 1}` : null,
        totalPage,
        currentPage,
        skip,
        limit
    };

    return paginationObj;
}

module.exports = getPagination;