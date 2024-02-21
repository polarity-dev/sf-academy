#!/bin/bash

if [ -n "$1" ]; then
    case $1 in
        # runs all the containers in the detach mode — all containers run in the background, so you can use a terminal for other purposes.
        -d)
            echo "Starting in detached mode.."
             docker-compose up -d
        ;;
        -r)
            echo "Starting and recreating all containers.."
             docker-compose up --force-recreate
        ;;
        #  stops all old containers that are running and will create them from scratch
        -rd)
            echo "Starting and recreating all containers in detached mode.."
             docker-compose up -d --force-recreate
        ;;
        # stops and removes all images
        -s)
            echo "Stopping.."
#            docker-compose rm
            docker-compose down --rmi all
        ;;
        *)
            echo "unknown argument"
        ;;
    esac
else
    echo "Starting.."
    docker-compose up
fi