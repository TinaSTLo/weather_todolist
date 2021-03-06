import { useState, useEffect, useCallback } from 'react';

const fetchCurrentWeather = (locationName) => {
    return fetch(
        `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-5DE01DD1-3DCA-4AFF-85A7-6D78002F1B20&locationName=${locationName}`
    )
        .then((response) => response.json())
        .then((data) => {
            const locationData = data.records.location[0];
            if (locationData) {
                const weatherElements = locationData.weatherElement.reduce(
                    (neededElements, item) => {
                        if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
                            neededElements[item.elementName] = item.elementValue;
                        }
                        return neededElements;
                    },
                    {}
                );
                return {
                    observationTime: locationData.time.obsTime,
                    locationName: locationData.locationName,
                    temperature: weatherElements.TEMP,
                    windSpeed: weatherElements.WDSD,
                    humid: weatherElements.HUMD,
                };
            } else {
                return {
                    observationTime: '',
                    locationName: 'No data',
                    temperature: 'No data',
                    windSpeed: 'No data',
                    humid: 'No data',
                };
            }
        });
};

const fetchWeatherForecast = (cityName) => {
    return fetch(
        `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-5DE01DD1-3DCA-4AFF-85A7-6D78002F1B20&locationName=${cityName}`
    )
        .then((response) => response.json())
        .then((data) => {
            const locationData = data.records.location[0];
            if (locationData) {
                const weatherElements = locationData.weatherElement.reduce(
                    (neededElements, item) => {
                        if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
                            neededElements[item.elementName] = item.time[0].parameter;
                        }
                        return neededElements;
                    },
                    {}
                );
                return {
                    description: weatherElements.Wx.parameterName,
                    weatherCode: weatherElements.Wx.parameterValue,
                    rainPossibility: weatherElements.PoP.parameterName,
                    comfortability: weatherElements.CI.parameterName,
                };
            } else {
                return {
                    description: 'No data',
                    weatherCode: 'No data',
                    rainPossibility: 'No data',
                    comfortability: 'No data',
                };
            }
        });
};

const useWeatherApi = (currentLocation) => {
    const { locationName, cityName } = currentLocation;

    const [weatherElement, setWeatherElement] = useState({
        observationTime: new Date(),
        locationName: '',
        humid: 0,
        temperature: 0,
        windSpeed: 0,
        description: '',
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true,//???????????????????????????????????? isLoading ?????? true
    });

    const fetchData = useCallback(() => {
        const fetchingData = async () => {
            const [currentWeather, weatherForecast] = await Promise.all([
                //?????????????????????????????? API ??????????????????
                fetchCurrentWeather(locationName),
                //?????????????????????????????? API ??????????????????
                fetchWeatherForecast(cityName),
            ]);

            //??? fetchData ???????????????????????????isLoading ????????? false
            setWeatherElement({
                ...currentWeather,
                ...weatherForecast,
                isLoading: false,
            });

        };
        // for ??????loading ?????? - fetchData ??????????????? API ???????????????fetchingData??????????????? isLoading ??????????????? true
        setWeatherElement(prevState => {
            return { ...prevState, isLoading: true };
        });

        fetchingData();
    }, [locationName, cityName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [weatherElement, fetchData];
}

export default useWeatherApi;