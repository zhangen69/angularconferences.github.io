<h1 align="center">
<img width="40" valign="bottom" src="https://angular.io/assets/images/logos/angular/angular.svg">
Angular Conferences Worldwide
</h1>
<h4 align="center">A collection of the world's best Angular conferences, all in one place.</h4>

---

<a href="https://ultimateangular.com" target="_blank"><img src="https://ultimateangular.com/assets/img/banners/ua-github.svg"></a>

---

> This repo contains the world's best Angular Conferences and meetups, if you host an event and would like to be listed please follow the steps below:

[Add Your Event](#add-your-event)

## Add Your Event

Fork this repo so you can commit directly to your account and submit a Pull Request to include your event.

Access the `_data` folder inside the project and find the correct year of your event (e.g. `_data/2018.json`).

> Please see [this example](/_data/2018.json) for reference on how to add the correct JSON.

Use the guide below to add your own event to the correct month inside the above file (please remove all JSON comments before submitting your Pull Request).

```js
{
  "metadata": {
    // Country code, find yours here:
    // https://www.nationsonline.org/oneworld/country_code_list.htm
    "country_code": "BE",
    // Town or City
    "location": "Ghent",
    // Conference / Event name
    "title": "ngBE",
    // Date of Event
    "date": "06-07",
    // Your event logo (for best results use SVG)
    // Please compress SVG before your PR:
    // https://jakearchibald.github.io/svgomg/
    "logo": "ngbe.svg",
    // The type of event, "conference" or "meetup"
    "type": "conference",
    // A *short* description of your event, max 400 characters.
    "desc": "NG-BE 2018 is a 2-day event in Ghent, Belgium, that brings together Angular developers and experts from all over the world to share ideas, news and opinions about Angular."
  },
  "links": {
    // Your event website
    "web": "https://ng-be.org",
    // Twitter handle (don't include @)
    "twitter": "ngBE"
  }
}
```
