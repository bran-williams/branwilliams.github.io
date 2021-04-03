class Paginator {
    constructor(items, itemsPerPage, buildItemHtml, itemNamePrefix, itemGroupName, paginationGroupName) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.buildItemHtml = buildItemHtml;
        this.itemNamePrefix = itemNamePrefix;
        this.itemGroupName = itemGroupName;
        this.paginationGroupName = paginationGroupName;
    }

    init() {
        const paginationGroup = $(this.paginationGroupName);

        // let's see if this allows us to access the class function!
        const paginator = this;

        // Populate the pagination group with page items that will reload new pages.
        // Only populate the pagination group if the number of articles is less than the number of links per page.
        if (this.items.length > this.itemsPerPage) {
            const numPages = Math.ceil(this.items.length / this.itemsPerPage);

            for (let i = 0; i < numPages; i++) {
                let itemId = this.itemNamePrefix + i;
                paginationGroup.append("<li id=\"" + itemId + "\" class=\"page-item\"><a class=\"page-link\" href=\""
                 + this.paginationGroupName + "\">" + (i + 1) + "</a></li>");
                $("#" + itemId).click(function() {
                    paginator.setPage(i);
                    $(this).addClass("active").siblings().removeClass("active");
                });
            }
        }

        paginator.setPage(0);
        $("#" + this.itemNamePrefix + "0").addClass("active");
    }

    setPage(pageIndex) {
        const itemGroup = $(this.itemGroupName);

        itemGroup.empty();

        let index = pageIndex * this.itemsPerPage;
        let endIndex = Math.min(index + this.itemsPerPage, this.items.length);

        while (index < endIndex) {
            const item = this.items[index];

            if (typeof item === "undefined") {
                console.log("Unable to find item for index=" + (pageIndex * this.itemsPerPage + i));
                return;
            }

            const itemLink = this.buildItemHtml(item);
            itemGroup.append(itemLink);
            index++;
        }

        // If possible, re-render any timestamps
        if (typeof flask_moment_render_all === "function") {
            flask_moment_render_all();
        }
    }
}