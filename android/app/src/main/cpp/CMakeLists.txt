cmake_minimum_required(VERSION 3.18.1)

project("native-lib")

add_library(native-lib SHARED
            src/main/cpp/native-lib.cpp)

find_library(log-lib
             log)

target_link_libraries(native-lib
                      ${log-lib})
