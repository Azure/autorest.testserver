# Autorest.testserver

This is a proxy recording of autorest.testserver. As such, there is two folders:
- vanilla for core testing which are not using ARM
- azure for ARM Autorest

Playing back vanilla tests passes all the tests, except one for big downloads. After discussing with Wiremock, the big downloads should be written in Java,
since there no point of doing a JSON file with a few gigabytes of base64 content

Azure tests mostly passes, except some LRO, but LRO testing in autorest.testserver is bad, so I don't blame Wiremock on this.