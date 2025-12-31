window.addEventListener("DOMContentLoaded", (event) => {
    const submit_button = document.getElementById("submit");
    var results_area    = document.getElementById("result");

    const integration = document.getElementById("integration");
    const loc_uid     = document.getElementById("location");
    const max_items   = document.getElementById("limit");
    const breadth     = document.querySelector("input[name='breadth']:checked");
    const order       = document.querySelector("input[name='order']:checked");
    const date_from   = document.getElementById("date-from");
    const date_to     = document.getElementById("date-to");
    const payload_str = document.getElementById("payload-string");

    // Dynamically load available tasks based on chosen integration
    var task_type   = document.getElementById("task_type");
    integration.addEventListener('change', function(e) {
        const which = integration.value
        switch (which) {
            case "VinSolutions":
                task_type.innerHTML = vinsolutions_tasks;
                break;
            case "CDK CRM":
                task_type.innerHTML = cdk_crm_tasks;
                break;
            case "Tekion":
                task_type.innerHTML = tekion_tasks;
                break;
            case "Dealertrack":
                task_type.innerHTML = dealertrack_tasks;
                break;
            case "HomeNet":
                task_type.innerHTML = homenet_tasks;
                break;
            case "HubSpot SMS":
                task_type.innerHTML = hubspot_tasks;
                break;
            case "Meta":
                task_type.innerHTML = meta_tasks;
                break;
            case "ServiceTitan":
                task_type.innerHTML = servicetitan_tasks;
                break;
        };
    });

    submit_button.addEventListener("click", function(e) {
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

const vinsolutions_tasks = `
    <option value="">All</option>
    <option value="lead_sync">Lead Sync</option>
    <option value="conversation_sync">Conversation Sync</option>
    <option value="conversation_assignment">Conversation Assignment</option>
    <option value="conversation_assignment_update">Conversation Assignment Update</option>
    <option value="stc">Stop The Clock</option>
    <option value="appointment_sync">Appointment Sync</option>
    <option value="ai_appointment_writeback">AI Appointment Writeback</option>
`;

const cdk_crm_tasks = `
    <option value="">All</option>
    <option value="sync_opportunities">Sync Opportunities</option>
    <option value="process_opportunity">Process Opportunity</option>
    <option value="sync_conversation_assignment">Conversation Assignment Sync</option>
`;

const tekion_tasks = `
    <option value="">All</option>
    <option value="sync_leads">Lead Sync</option>
    <option value="conversation_assignment">Conversation Assignment</option>
    <option value="leads_conversation_writeback">Conversation Writeback</option>
    <option value="leads_writeback">Lead Writeback</option>
    <option value="ai_appointment_writeback">AI Appointment Writeback</option>
    <option value="import_contacts">Import Contacts</option>
    <option value="import_assignees">Import Assignees</option>
    <option value="sync_assignees">Sync Assignees</option>
`;

const dealertrack_tasks = `
    <option value="">All</option>
    <option value="sync_deals">Sync Deals</option>
    <option value="import_deals">Import Deals</option>
`;

const homenet_tasks = `
    <option value="">All</option>
    <option value="inventory">Inventory</option>
    <option value="import_inventory">Import Inventory</option>
    <option value="create_salesforce_case">Create Salesforce Case</option>
`;

const hubspot_tasks = `
    <option value="">All</option>
    <option value="leads_conversation_writeback">Conversation Writeback</option>
    <option value="conversation_sync">Conversation Sync</option>
`;

const meta_tasks = `
    <option value="">All</option>
    <option value="process_lead">Process Lead</option>
`;

const servicetitan_tasks = `
    <option value="">All</option>
    <option value="sync_job_events">Sync Job Events</option>
    <option value="sync_contacts">Sync Contacts</option>
`;