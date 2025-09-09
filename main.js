window.addEventListener("DOMContentLoaded", (event) => {
    const submit_button = document.getElementById("submit");
    var results_area    = document.getElementById("result");

    submit_button.addEventListener("click", function(e) {
        const integration = document.getElementById("integration");
        const loc_uid     = document.getElementById("location");
        const task_type   = document.getElementById("task_type");
        const max_items   = document.getElementById("limit");
        const breadth     = document.querySelector("input[name='breadth']:checked");
        const order       = document.querySelector("input[name='order']:checked");
        const date_from   = document.getElementById("date-from");
        const date_to     = document.getElementById("date-to");
        const payload_str = document.getElementById("payload-string");

        //insert this extra string after 'distinct' and before 'from'
        var breadth_p1 = `select ${breadth.value} `
        if (breadth.value === 'distinct') {
            breadth_p1 += 'bridge_execution_completed_tasks[0] ';
        }

        //build individual query elements
        const breadth_string     = breadth_p1 + 'from BUILD.MARKETPLACE.BASE_EXECUTIONS_BRIDGE ';
        const integration_string = `where bridge_execution_integration_name = '${integration.value}' `;
        const loc_uid_string     = `and location_uid = '${loc_uid.value}' `;
        const task_type_string   = `and bridge_execution_completed_tasks[0] = '${task_type.value}' `;
        const date_range_string  = `and ${order.value} >= '${date_from.value}' and ${order.value} <= '${date_to.value}' `;
        const contains_string    = `and contains(bridge_execution_oban_args, '${payload_str.value}') `;
        const order_string       = `order by ${order.value} desc `;
        const limit_string       = `limit ${max_items.value};`;

        //Construct final query string
        results_area.value = breadth_string + integration_string + loc_uid_string;

        if (task_type.value !== "") {
            results_area.value = results_area.value + task_type_string;
        } 

        if (date_from.value !== "" && date_to.value !== "") {
            results_area.value = results_area.value + date_range_string;
        }

        if (payload_str.value !== "") {
            results_area.value = results_area.value + contains_string;
        }
        
        results_area.value = results_area.value + order_string + limit_string;

        //Copy the string to clipboard
        navigator.clipboard.writeText(results_area.value);
        document.getElementById('copied').style.display = "block";
        setTimeout(() => {
            document.getElementById('copied').style.display = "none";
        }, 2000);
    });
});

