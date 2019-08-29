# Nemea Dashboard

Nemea Dashboard is a graphical user interface to interact with Nemea alerts dabatase. 
It features multiple dashboards with beautiful graphs showing current state of servers monitored by Nemea system.
Previously [standalone application](https://github.com/CESNET/Nemea-Dashboard), that
is no longer supported.

## Installation
Download [Liberouter GUI](https://github.com/CESNET/liberouter-gui). Place `Dashboard` folder from this repository
into `modules` folder in Liberouter GUI and then follow [Liberouter gui's quick start tutorial](https://github.com/CESNET/liberouter-gui#quick-start).
If you are using default database settings, no more setup is required.
If you want to change database collections that this module uses, edit `backend/config.ini`.
Please keep in mind, that `collectionData` field have to be a collection containing 
alerts generated from Nemea framework.

## Getting help
For solving a problem with the module, create a new [issue](https://github.com/CESNET/Nemea-GUI/issues) and we will try to solve
your problem as soon as possible.

## Testing
Backend is covered with unit tests. You can run tests by navigating to this modules backend and
running `runtest.py`.
At the top of the file, you can set variable `GENERATED_ALERT_COUNT` to higher number, if you wish to
test modules behaviour on huge data sets. Keep in mind that anything above 1,000,000 alerts may cause
some tests to fail or take very long time to finish the tests.
