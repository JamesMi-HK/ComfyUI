# coding: utf-8

"""
    Generated by: https://github.com/openapi-json-schema-tools/openapi-json-schema-generator
"""

from comfy.api import api_client, exceptions
from comfy.api.shared_imports.operation_imports import *  # pyright: ignore [reportWildcardImportFromLibrary]

from .. import path
from .responses import (
    response_200,
    response_404,
)
from .parameters import parameter_0
from .path_parameters import PathParameters, PathParametersDictInput, PathParametersDict
path_parameter_classes = (
    parameter_0.Parameter0,
)


__StatusCodeToResponse = typing.TypedDict(
    '__StatusCodeToResponse',
    {
        '200': typing.Type[response_200.ResponseFor200],
        '404': typing.Type[response_404.ResponseFor404],
    }
)
_status_code_to_response: __StatusCodeToResponse = {
    '200': response_200.ResponseFor200,
    '404': response_404.ResponseFor404,
}
_non_error_status_codes = frozenset({
    '200',
})
_error_status_codes = frozenset({
    '404',
})

_all_accept_content_types = (
    "image/png",
)


class BaseApi(api_client.Api):
    @typing.overload
    def _api_v1_images_digest_get(
        self,
        path_params: typing.Union[
            PathParametersDictInput,
            PathParametersDict
        ],
        *,
        skip_deserialization: typing.Literal[False] = False,
        accept_content_types: typing.Tuple[str, ...] = _all_accept_content_types,
        server_index: typing.Optional[int] = None,
        stream: bool = False,
        timeout: typing.Optional[typing.Union[int, float, typing.Tuple]] = None,
    ) -> response_200.ApiResponse: ...

    @typing.overload
    def _api_v1_images_digest_get(
        self,
        path_params: typing.Union[
            PathParametersDictInput,
            PathParametersDict
        ],
        *,
        skip_deserialization: typing.Literal[True],
        accept_content_types: typing.Tuple[str, ...] = _all_accept_content_types,
        server_index: typing.Optional[int] = None,
        stream: bool = False,
        timeout: typing.Optional[typing.Union[int, float, typing.Tuple]] = None,
    ) -> api_response.ApiResponseWithoutDeserialization: ...

    def _api_v1_images_digest_get(
        self,
        path_params: typing.Union[
            PathParametersDictInput,
            PathParametersDict
        ],
        *,
        skip_deserialization: bool = False,
        accept_content_types: typing.Tuple[str, ...] = _all_accept_content_types,
        server_index: typing.Optional[int] = None,
        stream: bool = False,
        timeout: typing.Optional[typing.Union[int, float, typing.Tuple]] = None,
    ):
        """
        (API) Get image
        :param skip_deserialization: If true then api_response.response will be set but
            api_response.body and api_response.headers will not be deserialized into schema
            class instances
        """
        path_params = PathParameters.validate(
            path_params,
            configuration=self.api_client.schema_configuration
        )
        used_path, query_params_suffix = self._get_used_path(
            path,
            path_parameters=path_parameter_classes,
            path_params=path_params,
            skip_validation=True
        )
        headers = self._get_headers(accept_content_types=accept_content_types)
        # TODO add cookie handling
        host = self.api_client.configuration.get_server_url(
            "servers", server_index
        )

        raw_response = self.api_client.call_api(
            resource_path=used_path,
            method='get',
            host=host,
            headers=headers,
            stream=stream,
            timeout=timeout,
        )

        if skip_deserialization:
            skip_deser_response = api_response.ApiResponseWithoutDeserialization(response=raw_response)
            self._verify_response_status(skip_deser_response)
            return skip_deser_response

        status = str(raw_response.status)
        if status in _non_error_status_codes:
            status_code = typing.cast(
                typing.Literal[
                    '200',
                ],
                status
            )
            return _status_code_to_response[status_code].deserialize(
                raw_response, self.api_client.schema_configuration)
        elif status in _error_status_codes:
            error_status_code = typing.cast(
                typing.Literal[
                    '404',
                ],
                status
            )
            error_response = _status_code_to_response[error_status_code].deserialize(
                raw_response, self.api_client.schema_configuration)
            raise exceptions.ApiException(
                status=error_response.response.status,
                reason=error_response.response.reason,
                api_response=error_response
            )

        response = api_response.ApiResponseWithoutDeserialization(response=raw_response)
        self._verify_response_status(response)
        return response


class ApiV1ImagesDigestGet(BaseApi):
    # this class is used by api classes that refer to endpoints with operationId.snakeCase fn names
    api_v1_images_digest_get = BaseApi._api_v1_images_digest_get


class ApiForGet(BaseApi):
    # this class is used by api classes that refer to endpoints by path and http method names
    get = BaseApi._api_v1_images_digest_get
