/*!
 * Copyright 2015 Digital Services, University of Cambridge Licensed
 * under the Educational Community License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

define(['gh.core'], function(gh) {

    // Get the configuration
    var config = require('gh.core').config;
    // Get the correct terms associated to the current application
    var terms = config.terms[config.academicYear];

    /**
     * Render the agenda view
     *
     * @private
     */
    var renderAgendaView = function(terms) {
        gh.utils.renderTemplate($('#gh-my-agenda-view-template'), {
            'data': {
                'terms': terms,
                'utils': gh.utils
            }
        }, $('#gh-my-agenda-view-container'));
    };

    /**
     * Get all events for every term in the users calendar
     *
     * @private
     */
    var getAgendaViewData = function(term, week) {
        var startOffsetDays = week * 7;
        var endOffsetDays = (week * 7) + 7;

        var startDate = gh.utils.convertUnixDatetoISODate(moment(term.start).add({'days': startOffsetDays}).toISOString());
        var endDate = gh.utils.convertUnixDatetoISODate(moment(startDate).add({'days': endOffsetDays}).toISOString());

        // Get the user's events for each term in the year
        gh.api.userAPI.getUserCalendar(gh.data.me.id, startDate, endDate, function(err, data) {
            // Assign the term's events to the correct week in the cached object
            term.events = term.events || {};
            term.events[week] = data.results;
            // Update the agenda
            renderAgendaView(terms);
        });
    };

    /**
     * Show/hide the term when the header is clicked
     *
     * @private
     */
    var toggleTerm = function() {
        // Toggle the caret icon
        $(this).find('i').toggleClass('fa-caret-right fa-caret-down');
        // Toggle the event container
        $(this).parent().next().toggle();
    };

    /**
     * Add handlers to various elements in the agenda view
     */
    var addBinding = function() {
        $(document).on('shown.bs.tab', '#gh-calendar-view .gh-toolbar-primary a[data-toggle="tab"]', function(ev) {
            if ($(ev.target).attr('aria-controls') === 'gh-my-agenda-view') {
                getAgendaViewData(terms[0], 0);
                getAgendaViewData(terms[1], 0);
                getAgendaViewData(terms[2], 0);
            }
        });

        $(document).on('click', '.agenda-view-term-header > button', toggleTerm);
    };

    addBinding();
});