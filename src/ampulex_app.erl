-module(ampulex_app).
-behavior(application).
 
-export([start/2]).
-export([stop/1]).
-export([registry/1]).
 
start(_Type, _Args) ->
    RPid = spawn(?MODULE, registry, [[]]),
    SockjsState = sockjs_handler:init_state(
                    <<"/echo">>, fun service_echo/3, RPid, []),

    Dispatch = cowboy_router:compile([
        {'_', [
               {<<"/echo/[...]">>, sockjs_cowboy_handler, SockjsState},
               {"/static/[...]", cowboy_static, {priv_dir, ampulex, "",
                   [{mimetypes, cow_mimetypes, all}]}},

               {'_', ampulex_handler, []}
              ]
        }
    ]),
    %% Name, NbAcceptors, TransOpts, ProtoOpts
    cowboy:start_http(my_http_listener, 100,
        [{port, 8080}],
        [{env, [{dispatch, Dispatch}]}]
    ),
    ampulex_sup:start_link().
 
stop(_State) ->
    ok.

%% registry ------------------------------------------------

send_to_all([], _Msg) ->
    ok;
send_to_all([Conn|Rest], Msg) ->
    Conn:send(Msg),
    send_to_all(Rest, Msg).

registry(Connections) ->
    receive 
        {add, Conn} ->
            io:format("adding a connection to the pool~n"),
            registry([Conn|Connections]);
        {remove, Conn} ->
            io:format("removing a connection from the pool~n"),
            registry(Connections -- [Conn]);
        {broadcast, Msg} ->
            io:format("broadcasting message ~p~n", [Msg]),
            send_to_all(Connections, Msg),
            registry(Connections)
    end.

%% sockjs handler ------------------------------------------
service_echo(Conn, init, RPid)        -> 
    RPid ! {add, Conn},
    {ok, RPid};
service_echo(_Conn, {recv, Data}, RPid) -> 
    io:format("got: ~p~n", [Data]),
    io:format("sending it to: ~p~n", [RPid]),
    RPid ! {broadcast, Data},
    {ok, RPid};
service_echo(_Conn, {info, _Info}, State) -> {ok, State};
service_echo(Conn, closed, RPid)      -> 
    RPid ! {remove, Conn},
    {ok, RPid}.

